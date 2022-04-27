const objectMapper = require('object-mapper');

const serializerConfig = {
  code: 'codigo',
  description: 'descricao',
  'accessories[].inputType': 'acessorios[].tipoEntrada',
  'accessories[].min': 'acessorios[].min',
  'accessories[].max': 'acessorios[].max',
  'accessories[].type': 'acessorios[].tipo',
  'accessories[].code': 'acessorios[].codigo',
  'accessories[].name': 'acessorios[].nome',
  'accessories[].description': 'acessorios[].descricao',
  'additionals[].options[].code': 'adicionais[].opcoes[].codigo',
  'additionals[].options[].name': 'adicionais[].opcoes[].nome',
  'additionals[].options[].description': 'adicionais[].opcoes[].descricao',
  'additionals[].type': 'adicionais[].tipo',
  'additionals[].code': 'adicionais[].codigo',
  'additionals[].name': 'adicionais[].nome',
  'additionals[].description': 'adicionais[].descricao',
  'guarantees[].inputType': 'garantias[].tipoEntrada',
  'guarantees[].min': 'garantias[].min',
  'guarantees[].max': 'garantias[].max',
  'guarantees[].type': 'garantias[].tipo',
  'guarantees[].code': 'garantias[].codigo',
  'guarantees[].name': 'garantias[].nome',
  'guarantees[].description': 'garantias[].descricao',
  'guarantees[].options[].code': 'garantias[].opcoes[].codigo',
  'guarantees[].options[].name': 'garantias[].opcoes[].nome',
  'guarantees[].options[].description': 'garantias[].opcoes[].descricao'
};

const serialize = (opcao) => objectMapper(opcao, {}, serializerConfig);
const serializeLista = (opcoesDeOfertas) => opcoesDeOfertas.map((opcao) => serialize(opcao));

module.exports = {
  serialize,
  serializeLista
};
