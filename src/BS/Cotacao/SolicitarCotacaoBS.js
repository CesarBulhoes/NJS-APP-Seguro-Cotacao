const consoleStp = require('libStpInvoke').Console;

const { CotacaoDAO, EnviarCotacaoParaFilaDAO } = require('../../DAO');
const { serialize } = require('../../Serializers/Cotacao/SolicitarCotacaoSerializer');
const { StatusCotacaoEnum } = require('../../Utils/Enums');
const { InvalidRequestError } = require('../../Utils/Errors');
const { GetCurrentDate, HttpResponse, RequestValidator } = require('../../Utils/Helpers');
const { AutoApi, AutoApiAdapter } = require('../../Utils/Wiz');
const { SolicitarCotacaoSchema } = require('../../Validators/Schemas');

const validarRequisicao = (data) => new RequestValidator({ schema: SolicitarCotacaoSchema }).validate(data);

const registrarCotacao = async (data, idCotacao) => {
  const dataAtual = GetCurrentDate.get();
  const cotacao = {
    ...data,
    idCotacao,
    statusCotacao: StatusCotacaoEnum.PROCESSANDO,
    dataCriacao: dataAtual,
    dataAtualizacao: dataAtual
  };

  await CotacaoDAO.registrar(cotacao);
  return cotacao;
};

exports.solicitar = async (data) => {
  try {
    const { value: cotacao, erro } = validarRequisicao(data);
    if (!erro) return HttpResponse.badRequest(new InvalidRequestError(erro));

    const respostaAutoApi = await AutoApi.solicitarCotacao(AutoApiAdapter.solicitarCotacaoAdapter(cotacao));
    consoleStp.payload({ arquivo: 'solicitar-cotacao-service', payload: respostaAutoApi });

    const resposta = await registrarCotacao(cotacao, respostaAutoApi.quotationRequestId);
    // await EnviarCotacaoParaFilaDAO.enviarParaFila(resposta);

    return HttpResponse.ok(serialize(resposta));
  } catch (erro) {
    consoleStp.error(erro);
    return HttpResponse.exceptionHandler(erro);
  }
};
