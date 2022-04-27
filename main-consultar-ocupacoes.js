const consoleStp = require('libStpInvoke').Console;

const consultarConsultarIndex = require('./index-consultar-ocupacoes');

const event = {
  headers: {
    codigocliente: 'qualquer_NRC'
  }
};

function callback(erro, data) {
  consoleStp.info('*******************');
  consoleStp.info('Erro: ', erro === null ? 'Não há erros' : erro);
  consoleStp.info('*******************');
  consoleStp.info('Sucesso: ', JSON.stringify(data));
  consoleStp.info('*******************');
}

consultarConsultarIndex.execute(event, null, callback);
