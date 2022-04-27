const consoleStp = require('libStpInvoke').Console;

const consultarCotacaoIndex = require('./index-consultar-cotacao');

const requisicao = {
  headers: {
    codigocliente: 'qualquer_NRC'
  },
  data: {
    // idCotacao: '0f6daefa-840e-4a04-9827-aab667dbe2bf'
    // idCotacao: '063e9c90-f08e-4a9b-b020-727cc88d6cae'
    idCotacao: '3200e9c5-6f2e-4d5f-93ce-ce218c3e3107'
  }
};

const callback = (erro, data) => {
  consoleStp.info('*******************');
  consoleStp.info('Erro: ', erro === null ? 'Não há erros' : erro);
  consoleStp.info('*******************');
  consoleStp.info('Sucesso: ', JSON.stringify(data));
  consoleStp.info('*******************');
};

consultarCotacaoIndex.execute(requisicao, null, callback);
