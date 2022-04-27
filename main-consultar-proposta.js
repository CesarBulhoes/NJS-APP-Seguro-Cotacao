const consoleStp = require('libStpInvoke').Console;

const consultarCotacaoIndex = require('./index-consultar-proposta');

const requisicao = {
  headers: {
    codigocliente: 'qualquer_NRC'
  },
  data: {
    idProposta: 'd128c52a-fdac-4c04-ba29-326b3f3070e0'
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
