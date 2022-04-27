const consoleStp = require('libStpInvoke').Console;

const test = require('./index-solicitar-cotacao');

const requisicao = {
  headers: {
    codigocliente: 'qualquer_NRC'
  },
  data: {
    nome: 'Augusto',
    cpf: '111111111111',
    email: 'cesar@valido.com',
    cepPernoite: '33333-772',
    provedores: ['HDI SEGUROS S.A', 'HDI SEGUROS S.A'],
    veiculo: {
      placa: 'BOT4521',
      modelo: 'BOT S 1.0 16V FLEX FUEL 5P'
    }
  }
};

const callback = (erro, data) => {
  consoleStp.info('*******************');
  consoleStp.info('Erro: ', erro === null ? 'Não há erros' : erro);
  consoleStp.info('*******************');
  consoleStp.info('Sucesso: ', JSON.stringify(data));
  consoleStp.info('*******************');
};

test.execute(requisicao, null, callback);
