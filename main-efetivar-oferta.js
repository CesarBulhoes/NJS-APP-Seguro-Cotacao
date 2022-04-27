const consoleStp = require('libStpInvoke').Console;

const test = require('./index-efetivar-oferta');

const requisicao = {
  headers: { codigocliente: '234' },
  data: {
    cpf: '59061257794',
    idCotacao: 'c87e678f-945c-44d2-9fdb-3fc0cd84bd79',
    idOferta: 'dc1b4d2a-603f-44a7-b6a3-13fd16a1d8ed',
    codigoMetodoPagamento: 'C',
    totalParcelas: 3,
    codigoChassi: '0001',
    nome: 'Kelvin Cleto',
    ocupacao: 'Programador',
    codigoOcupacao: '015518',
    rendaMensalMedia: 3333.0,
    dataNascimento: '1992-04-05',
    email: 'kcleto@gclaims.com.br',
    telefone: '5511996778823',
    sexo: 'F',
    estadoCivil: 3,
    endereco: {
      nomeEndereco: 'Rua antonio Cardoso de Veiga',
      cidade: 'Sorocaba',
      complemento: 'Casa',
      bairro: 'Jardim das Flores',
      numero: '284',
      estado: 'São Paulo',
      uf: 'SP',
      cep: '18071-772'
    },
    documentos: []
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
