const consoleStp = require('libStpInvoke').Console;

const BuscarVeiculoSerializer = require('../../Serializers/Veiculo');
const { InvalidRequestError } = require('../../Utils/Errors');
const { HttpResponse, ObterListaSemDuplicatas, RequestValidator } = require('../../Utils/Helpers');
const { AutoApi } = require('../../Utils/Wiz');
const { ConsultarVeiculoSchema } = require('../../Validators/Schemas');

const validarRequisicao = (data) => new RequestValidator({ schema: ConsultarVeiculoSchema }).validate(data);

exports.buscar = async (data) => {
  try {
    const { value: veiculo, erro } = validarRequisicao(data);
    if (erro) return HttpResponse.badRequest(new InvalidRequestError(erro));
    const { placa } = veiculo;

    const listaDeVeiculos = await AutoApi.buscarVeiculo(placa);
    consoleStp.payload({ arquivo: 'buscar-veiculo-service', payload: listaDeVeiculos });

    const resposta = BuscarVeiculoSerializer.serializeLista(listaDeVeiculos);
    return HttpResponse.ok(ObterListaSemDuplicatas.obter(resposta));
  } catch (erro) {
    consoleStp.error(erro);
    return HttpResponse.exceptionHandler(erro);
  }
};
