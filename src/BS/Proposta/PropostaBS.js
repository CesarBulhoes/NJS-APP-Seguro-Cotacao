const consoleStp = require('libStpInvoke').Console;

const { PropostaDAO } = require('../../DAO');
const { serialize, serializeLista } = require('../../Serializers/Proposta/PropostaSerializer');
const { InvalidRequestError } = require('../../Utils/Errors');
const { HttpResponse, RequestValidator } = require('../../Utils/Helpers');
const { ConsultarPropostaSchema } = require('../../Validators/Schemas');

const validarRequisicao = (data) => new RequestValidator({ schema: ConsultarPropostaSchema }).validate(data);

const ordenarPropostasPorDataCriacao = (proposta, propostaComparacao) => {
  const data = new Date(proposta.dataCriacao);
  const dataComparacao = new Date(propostaComparacao.dataCriacao);

  return dataComparacao - data;
};

exports.consultar = async (data) => {
  try {
    const { value: proposta, erro } = validarRequisicao(data);
    if (erro) return HttpResponse.badRequest(new InvalidRequestError(erro));
    const { NRC, idProposta } = proposta;

    if (idProposta) {
      const resposta = await PropostaDAO.consultarPorChave({ NRC, idProposta });
      return HttpResponse.ok((resposta && serialize(resposta)) || {});
    }

    const resposta = await PropostaDAO.consultarPorNRC({ NRC });
    resposta.sort(ordenarPropostasPorDataCriacao);

    return HttpResponse.ok(serializeLista(resposta));
  } catch (erro) {
    consoleStp.error(erro);
    return HttpResponse.exceptionHandler(erro);
  }
};
