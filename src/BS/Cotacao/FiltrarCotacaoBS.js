const consoleStp = require('libStpInvoke').Console;

const { CotacaoDAO } = require('../../DAO');
const { serialize, serializeLista } = require('../../Serializers/Cotacao/ConsultarCotacaoSerializer');
const { InvalidRequestError } = require('../../Utils/Errors');
const { HttpResponse, RequestValidator } = require('../../Utils/Helpers');
const { FiltrarCotacaoSchema } = require('../../Validators/Schemas');

const validarRequisicao = (data) => new RequestValidator({ schema: FiltrarCotacaoSchema }).validate(data);

const ordenarCotacoesPorDataCriacao = (cotacao, cotacaoComparacao) => {
  const data = new Date(cotacao.dataCriacao);
  const dataComparacao = new Date(cotacaoComparacao.dataCriacao);

  return dataComparacao - data;
};

exports.filtrar = async (data) => {
  try {
    const { value: parametros, erro } = validarRequisicao(data);

    if (erro) return HttpResponse.badRequest(new InvalidRequestError(erro));
    const { cpf, cepPernoite, nome, modelo, placa, provedores, statusCotacao, dataInicio, dataFim, pagina, limite } =
      parametros;

    const resposta = await CotacaoDAO.filtrar({
      cpf,
      cepPernoite,
      nome,
      modelo,
      placa,
      provedores,
      statusCotacao,
      dataInicio,
      dataFim,
      pagina,
      limite
    });

    resposta.itens.sort(ordenarCotacoesPorDataCriacao);

    resposta.itens = serializeLista(resposta.itens);

    resposta.itens.forEach((el) => console.log(JSON.stringify(el), '\n'));
    console.log({ listados: resposta.listados, total: resposta.total, proximaPagina: resposta.proximaPagina });
    return HttpResponse.ok(resposta);
  } catch (erro) {
    consoleStp.error(erro);
    return HttpResponse.exceptionHandler(erro);
  }
};
