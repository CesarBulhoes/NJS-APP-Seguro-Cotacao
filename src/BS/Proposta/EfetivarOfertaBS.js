const consoleStp = require('libStpInvoke').Console;

const { PropostaDAO, CotacaoDAO } = require('../../DAO');
const { serialize } = require('../../Serializers/Proposta/PropostaSerializer');
const { StatusPropostaEnum, StatusCotacaoEnum } = require('../../Utils/Enums');
const { InvalidRequestError } = require('../../Utils/Errors');
const { HttpResponse, RequestValidator, GetCurrentDate } = require('../../Utils/Helpers');
const { AutoApi, AutoApiAdapter } = require('../../Utils/Wiz');
const { EfetivarOfertaSchema } = require('../../Validators/Schemas');

const validarRequisicao = (data) => new RequestValidator({ schema: EfetivarOfertaSchema }).validate(data);

exports.execute = async (data) => {
  try {
    consoleStp.payload({ data });
    const { value: proposta, erro } = validarRequisicao(data);
    if (erro) return HttpResponse.badRequest(new InvalidRequestError(erro));

    const respotaAutoApi = await AutoApi.efetivarOferta(AutoApiAdapter.efetivarOferta(proposta));
    consoleStp.payload({ arquivo: 'EfetivarOfertaBS', payload: respotaAutoApi });

    const { NRC, idCotacao } = proposta;
    const cotacao = await CotacaoDAO.consultar({ NRC, idCotacao });

    const dataAtual = GetCurrentDate.get();
    const payload = {
      idProposta: respotaAutoApi && respotaAutoApi.id,
      statusProposta: StatusPropostaEnum.TRANSMITIDA,
      numero: respotaAutoApi && respotaAutoApi.number,
      ...proposta,
      dataCriacao: dataAtual,
      dataAtualizacao: dataAtual,
      valorLiquidoPremio: cotacao && cotacao.dadosAdicionais && cotacao.dadosAdicionais.valorLiquidoPremio,
      iof: cotacao && cotacao.dadosAdicionais && cotacao.dadosAdicionais.iof,
      valorPremio: cotacao && cotacao.dadosAdicionais && cotacao.dadosAdicionais.valorPremio,
      veiculo: cotacao && cotacao.dadosAdicionais && cotacao.dadosAdicionais.veiculo,
      coberturas: cotacao && cotacao.dadosAdicionais && cotacao.dadosAdicionais.coberturas,
      nomeProvedor: cotacao && cotacao.ofertas && cotacao.ofertas.nomeProvedor
    };

    const resposta = await PropostaDAO.registrar(payload);

    await CotacaoDAO.atualizar({
      NRC,
      idCotacao,
      statusCotacao: StatusCotacaoEnum.EFETIVADO,
      dataAtualizacao: dataAtual
    });

    return HttpResponse.ok(resposta && serialize(resposta));
  } catch (erro) {
    consoleStp.error(erro);
    return HttpResponse.exceptionHandler(erro);
  }
};
