const consoleStp = require('libStpInvoke').Console;

const { serializeLista } = require('../../Serializers/Oferta/OpcoesDeCoberturasSerializer');
const { InvalidRequestError } = require('../../Utils/Errors');
const { HttpResponse, RequestValidator } = require('../../Utils/Helpers');
const { AutoApi } = require('../../Utils/Wiz');
const { ConsultarOpcoesDeCoberturasSchema } = require('../../Validators/Schemas');

const validarRequisicao = (data) => new RequestValidator({ schema: ConsultarOpcoesDeCoberturasSchema }).validate(data);

exports.consultar = async (data) => {
  try {
    const { value: oferta, erro } = validarRequisicao(data);
    if (erro) return HttpResponse.badRequest(new InvalidRequestError(erro));
    const { idOferta } = oferta;

    const opcoesDeCoberturas = await AutoApi.buscarOpcoesDeCobertura(idOferta);
    consoleStp.payload({ arquivo: 'ConsultarOpcoesDeCoberturasBS', payload: opcoesDeCoberturas });

    return HttpResponse.ok(serializeLista(opcoesDeCoberturas));
  } catch (erro) {
    consoleStp.error(erro);
    return HttpResponse.exceptionHandler(erro);
  }
};
