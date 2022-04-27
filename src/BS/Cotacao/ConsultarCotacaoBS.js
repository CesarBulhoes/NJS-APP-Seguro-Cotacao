const consoleStp = require('libStpInvoke').Console;

const { CotacaoDAO } = require('../../DAO');
const { serialize, serializeLista } = require('../../Serializers/Cotacao/ConsultarCotacaoSerializer');
const { InvalidRequestError } = require('../../Utils/Errors');
const { HttpResponse, RequestValidator } = require('../../Utils/Helpers');
const { ConsultarCotacaoSchema } = require('../../Validators/Schemas');

const validarRequisicao = (data) => new RequestValidator({ schema: ConsultarCotacaoSchema }).validate(data);

const ordenarCotacoesPorDataCriacao = (cotacao, cotacaoComparacao) => {
  const data = new Date(cotacao.dataCriacao);
  const dataComparacao = new Date(cotacaoComparacao.dataCriacao);

  return dataComparacao - data;
};

exports.consultar = async (data) => {
  try {
    const { value: cotacao, erro } = validarRequisicao(data);
    if (erro) return HttpResponse.badRequest(new InvalidRequestError(erro));
    const { NRC, idCotacao } = cotacao;

    if (idCotacao) {
      const resposta = await CotacaoDAO.consultar({ NRC, idCotacao });
      return HttpResponse.ok((resposta && serialize(resposta)) || {});
    }

    const resposta = await CotacaoDAO.consultarPorNRC({ NRC });
    resposta.sort(ordenarCotacoesPorDataCriacao);

    return HttpResponse.ok(serializeLista(resposta));
  } catch (erro) {
    consoleStp.error(erro);
    return HttpResponse.exceptionHandler(erro);
  }
};
