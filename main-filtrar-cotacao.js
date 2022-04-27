const consoleStp = require('libStpInvoke').Console;

const filtrarCotacaoIndex = require('./index-filtrar-cotacao');

const requisicao = {
  headers: {
    codigocliente: 'qualquer_NRC'
  },
  data: {
    // idCotacao: 'd128c52a-fdac-4c04-ba29-326b3f3070e0'
  },
  query: {
    // cpf: '111111111111',
    statusCotacao: 'processando',
    // nome: 'Augusto',
    cepPernoite: '33333-772',
    // modelo: 'bot',
    // placa: 'bot',
    provedores: ['TESTE SEGUROS S.A', 'HDI SEGUROS S.A', 'NOT SEGUROS S.A'],
    dataInicio: new Date('2022-04-20'),
    dataFim: new Date('2022-04-30'),
    // pagina: '{"cpf":"111111111111","NRC":"qualquer_NRC","idCotacao":"91420f88-1e4a-42ab-8969-387be04d8a8f"}',
    limite: 10
  }
};

const callback = (erro, data) => {
  consoleStp.info('*******************');
  consoleStp.info('Erro: ', erro === null ? 'Não há erros' : erro);
  consoleStp.info('*******************');
  consoleStp.info('Sucesso: ', JSON.stringify(data));
  consoleStp.info('*******************');
};

filtrarCotacaoIndex.execute(requisicao, null, callback);
