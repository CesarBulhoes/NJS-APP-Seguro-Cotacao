const consoleStp = require('libStpInvoke').Console;

const { CotacaoDAO } = require('../../DAO');
const { AtualizarCotacaoSerializer } = require('../../Serializers/Cotacao');
const { StatusCotacaoEnum, StatusCotacaoWizEnum } = require('../../Utils/Enums');
const { GetCurrentDate, HttpResponse } = require('../../Utils/Helpers');
const { AutoApi } = require('../../Utils/Wiz');

const setStatusCotacao = {
  [StatusCotacaoWizEnum.PROCESSANDO]: StatusCotacaoEnum.PROCESSANDO,
  [StatusCotacaoWizEnum.CONCLUIDO]: StatusCotacaoEnum.CONCLUIDO
};

const persistir = async ({ NRC, idCotacao, ...data }) => {
  const updateData = {
    ...data,
    NRC,
    idCotacao,
    dataAtualizacao: GetCurrentDate.get()
  };

  return CotacaoDAO.atualizar(updateData);
};

exports.atualizar = async (data) => {
  try {
    const { NRC, idCotacao } = data;
    const { status, offers, rejections } = await AutoApi.consultarDetalheCotacao(idCotacao);
    consoleStp.payload({ arquivo: 'atualizar-cotacao-service', payload: { status, offers, rejections } });

    const statusCotacao = setStatusCotacao[status && status.name];
    if (statusCotacao === StatusCotacaoEnum.PROCESSANDO) {
      return HttpResponse.badRequest({ message: 'Cotação processando!' });
    }

    const dadosCotacao = { NRC, idCotacao };
    const cotacaoValida = statusCotacao === StatusCotacaoEnum.CONCLUIDO && offers && offers.length > 0;

    if (!cotacaoValida) {
      const rejeicoes = rejections && AtualizarCotacaoSerializer.rejeicoesSerializer(rejections);
      if (rejeicoes) dadosCotacao.rejeicoes = rejeicoes;

      dadosCotacao.statusCotacao = StatusCotacaoEnum.CANCELADO;
    } else {
      const informacoesDaCotacao = [
        AutoApi.consultarOferta(offers[0].id),
        AutoApi.buscarOpcoesDeCobertura(offers[0].id)
      ];

      const [oferta, opcoesDeCobertura] = await Promise.all(informacoesDaCotacao);
      consoleStp.payload({ arquivo: 'atualizar-cotacao-service', payload: { oferta } });

      dadosCotacao.statusCotacao = StatusCotacaoEnum.CONCLUIDO;
      dadosCotacao.ofertas = AtualizarCotacaoSerializer.ofertasSerializer(oferta);
      dadosCotacao.dadosAdicionais = AtualizarCotacaoSerializer.dadosAdicionaisSerializer({
        opcoesDeCobertura,
        oferta: oferta.data
      });
    }

    await persistir(dadosCotacao);
    return HttpResponse.ok({ mensagem: 'Cotação atualizada.' });
  } catch (erro) {
    consoleStp.error(erro);
    return HttpResponse.exceptionHandler(erro);
  }
};
