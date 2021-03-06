const { NOME_DA_TABELA_DE_PROPOSTA } = require('../Config/Env');
const { DYNAMODB_DOCUMENT_CLIENT } = require('../Config/RecursosAWS');
const { MissingParamError } = require('../Utils/Errors');
const { DynamodbHelper } = require('../Utils/Helpers');

exports.registrar = async (data = {}) => {
  if (!data.NRC) throw new MissingParamError('NRC');
  if (!data.idProposta) throw new MissingParamError('idCotacao');

  const parametros = {
    TableName: NOME_DA_TABELA_DE_PROPOSTA,
    Item: data
  };

  await DYNAMODB_DOCUMENT_CLIENT.put(parametros).promise();
  return data;
};

exports.consultarPorChave = async (chave) => {
  const parametros = {
    TableName: NOME_DA_TABELA_DE_PROPOSTA,
    Key: chave
  };

  const resposta = await DYNAMODB_DOCUMENT_CLIENT.get(parametros).promise();
  return resposta.Item;
};

exports.consultarPorNRC = async ({ NRC }) => {
  if (!NRC) throw new MissingParamError('NRC');

  const parametros = {
    TableName: NOME_DA_TABELA_DE_PROPOSTA,
    KeyConditionExpression: 'NRC = :NRC',
    ExpressionAttributeValues: { ':NRC': NRC }
  };

  const resposta = await DYNAMODB_DOCUMENT_CLIENT.query(parametros).promise();
  return resposta.Items;
};

exports.listar = async (data) => {
  const parametros = {
    TableName: NOME_DA_TABELA_DE_PROPOSTA
  };
  Object.assign(parametros, DynamodbHelper.makeDynamicScanParams(data));

  const resposta = await DYNAMODB_DOCUMENT_CLIENT.scan(parametros).promise();
  return resposta.Items;
};
