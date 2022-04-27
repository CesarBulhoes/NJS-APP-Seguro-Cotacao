const consoleStp = require('libStpInvoke').Console;

const consultarOpcoesDeCoberturasIndex = require('./index-consultar-opcoes-de-coberturas');

const requisicao = {
  data: {
    idOferta: 'f507ac69-83bd-4a3d-a9fc-3a892805ece7'
  }
};

const callback = (erro, data) => {
  consoleStp.info('*******************');
  consoleStp.info('Erro: ', erro === null ? 'Não há erros' : erro);
  consoleStp.info('*******************');
  consoleStp.info('Sucesso: ', JSON.stringify(data));
  consoleStp.info('*******************');
};

consultarOpcoesDeCoberturasIndex.execute(requisicao, null, callback);
