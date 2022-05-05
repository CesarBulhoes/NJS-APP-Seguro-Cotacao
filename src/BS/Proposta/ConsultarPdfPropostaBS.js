const consoleStp = require('libStpInvoke').Console;

const { PropostaDAO } = require('../../DAO');
const { serialize, serializeLista } = require('../../Serializers/Cotacao/ConsultarCotacaoSerializer');
const { InvalidRequestError } = require('../../Utils/Errors');
const { HttpResponse, RequestValidator } = require('../../Utils/Helpers');
const { ConsultarPdfPropostaSchema } = require('../../Validators/Schemas');

const validarRequisicao = (data) => new RequestValidator({ schema: ConsultarPdfPropostaSchema }).validate(data);

exports.consultar = async (data) => {
  try {
    const { value: parametros, erro } = validarRequisicao(data);

    if (erro) return HttpResponse.badRequest(new InvalidRequestError(erro));
    let { NRC, idProposta } = parametros;

    const resposta = await PropostaDAO.consultarPdf({ idProposta });

    const url = resposta;

    const dataExpiracao = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString();

    if (url) await PropostaDAO.salvarPdf({ NRC, idProposta, url, dataExpiracao });

    return HttpResponse.ok(resposta);
  } catch (erro) {
    consoleStp.error(erro);
    return HttpResponse.exceptionHandler(erro);
  }
};
