const consoleStp = require('libStpInvoke').Console;

const consultarPdfPropostaIndex = require('./index-consultar-pdf-proposta');

const requisicao = {
  headers: {
    codigocliente: 'qualquer_NRC'
  },
  params: {
    idProposta: 'edef1812-726c-42e5-bd07-2dac3301b5ff'
  }
};

const callback = (erro, data) => {
  consoleStp.info('*******************');
  consoleStp.info('Erro: ', erro === null ? 'Não há erros' : erro);
  consoleStp.info('*******************');
  consoleStp.info('Sucesso: ', JSON.stringify(data));
  consoleStp.info('*******************');
};

consultarPdfPropostaIndex.execute(requisicao, null, callback);
