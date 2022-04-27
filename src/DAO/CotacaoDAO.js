const { NOME_DA_TABELA_DE_COTACAO } = require('../Config/Env');
const { DYNAMODB_DOCUMENT_CLIENT } = require('../Config/RecursosAWS');
const { MissingParamError } = require('../Utils/Errors');
const { DynamodbHelper } = require('../Utils/Helpers');

exports.registrar = async (payload = {}) => {
  if (!payload.NRC) throw new MissingParamError('NRC');
  if (!payload.idCotacao) throw new MissingParamError('idCotacao');

  const parametros = {
    TableName: NOME_DA_TABELA_DE_COTACAO,
    Item: payload
  };

  await DYNAMODB_DOCUMENT_CLIENT.put(parametros).promise();
  return payload;
};

exports.consultar = async ({ NRC, idCotacao } = {}) => {
  if (!NRC) throw new MissingParamError('NRC');
  if (!idCotacao) throw new MissingParamError('idCotacao');

  const parametros = {
    TableName: NOME_DA_TABELA_DE_COTACAO,
    Key: { NRC, idCotacao }
  };

  const resposta = await DYNAMODB_DOCUMENT_CLIENT.get(parametros).promise();
  return resposta.Item;
};

exports.consultarPorNRC = async ({ NRC } = {}) => {
  if (!NRC) throw new MissingParamError('NRC');
  const parametros = {
    TableName: NOME_DA_TABELA_DE_COTACAO,
    KeyConditionExpression: 'NRC = :NRC',
    ExpressionAttributeValues: { ':NRC': NRC }
  };

  const resposta = await DYNAMODB_DOCUMENT_CLIENT.query(parametros).promise();
  return resposta.Items;
};

exports.atualizar = async ({ NRC, idCotacao, ...data } = {}) => {
  if (!NRC) throw new MissingParamError('NRC');
  if (!idCotacao) throw new MissingParamError('idCotacao');

  const parametros = {
    TableName: NOME_DA_TABELA_DE_COTACAO,
    Key: { NRC, idCotacao },
    ReturnValues: 'ALL_NEW'
  };
  Object.assign(parametros, DynamodbHelper.makeDynamicUpdateParams(data));

  const updateResult = await DYNAMODB_DOCUMENT_CLIENT.update(parametros).promise();
  return updateResult.Attributes;
};

exports.listar = async (data) => {
  const parametros = {
    TableName: NOME_DA_TABELA_DE_COTACAO
  };
  Object.assign(parametros, DynamodbHelper.makeDynamicScanParams(data));

  const resposta = await DYNAMODB_DOCUMENT_CLIENT.scan(parametros).promise();
  return resposta.Items;
};

exports.filtrar = async ({
  cpf,
  statusCotacao,
  cepPernoite,
  nome,
  modelo,
  placa,
  provedores,
  dataInicio,
  dataFim,
  pagina = null,
  limite = 10
} = {}) => {
  let filtro = {
    query: [],
    equal: [],
    contains: [],
    contains_nested: [],
    contains_array: [],
    between: [],
    page: [{ pagina }],
    limit: [{ limite }],
    table: [{ NOME_DA_TABELA_DE_COTACAO }]
  };

  if (cpf) {
    filtro['query'].push({ cpf });
    if (statusCotacao) filtro['equal'].push({ statusCotacao });
  } else if (statusCotacao) {
    filtro['query'].push({ statusCotacao });
    if (cpf) filtro['equal'].push({ cpf });
  }

  if (cepPernoite) filtro['equal'].push({ cepPernoite });

  if (nome) filtro['contains'].push({ nome });

  if (dataInicio && dataFim) filtro['between'].push({ dataInicio, dataFim, column: 'dataCriacao' });

  if (modelo) filtro['contains_nested'].push({ path: ['veiculo', 'modelo'], modelo });

  if (placa) filtro['contains_nested'].push({ path: ['veiculo', 'placa'], placa });

  if (provedores?.length) filtro['contains_array'].push({ provedores });

  const parametros = DynamodbHelper.makeDynamicQueryGlobalSecondaryParams(filtro);

  let resposta = {},
    total = 0;

  if (cpf || statusCotacao) {
    total = await DYNAMODB_DOCUMENT_CLIENT.query(DynamodbHelper.getTotalQueryParams({ ...parametros })).promise();
    resposta = await DYNAMODB_DOCUMENT_CLIENT.query({ ...parametros }).promise();
  } else {
    total = await DYNAMODB_DOCUMENT_CLIENT.scan(DynamodbHelper.getTotalQueryParams({ ...parametros })).promise();
    resposta = await DYNAMODB_DOCUMENT_CLIENT.scan({ ...parametros }).promise();
  }

  return {
    itens: resposta.Items,
    listados: resposta.Items.length,
    total: total.Count,
    proximaPagina: JSON.stringify(resposta.LastEvaluatedKey)
  };
};
