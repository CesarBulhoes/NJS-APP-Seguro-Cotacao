const consoleStp = require('libStpInvoke').Console;

const registrarConsultarVeiculoIndex = require('./index-consulta-veiculo');

const requisicao = {
  data: {
    placa: 'MJN4967'
  }
};

const callback = (erro, data) => {
  consoleStp.info('*******************');
  consoleStp.info('Erro: ', erro === null ? 'Não há erros' : erro);
  consoleStp.info('*******************');
  consoleStp.info('Sucesso: ', JSON.stringify(data));
  consoleStp.info('*******************');
};

registrarConsultarVeiculoIndex.execute(requisicao, null, callback);
