const { MissingParamError } = require('../Errors');
const JsonHelper = require('../Helpers/JsonHelper');

exports.makeDynamicUpdateParams = (payload) => {
  if (!payload) throw new MissingParamError('payload');

  const hasAtLeastOneKey = Object.keys(payload).length > 0;
  if (!hasAtLeastOneKey) return null;

  const expressionAttributeValues = {};
  const expressionAttributeNames = {};
  const updateExpression = [];

  Object.keys(payload).forEach((key) => {
    expressionAttributeValues[`:${key}`] = payload[key];
    expressionAttributeNames[`#${key}`] = key;
    updateExpression.push(`#${key} = :${key}`);
  });

  return {
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
    UpdateExpression: `SET ${updateExpression.join(', ')}`
  };
};

exports.makeDynamicScanParams = (payload) => {
  if (!payload) throw new MissingParamError('payload');

  const hasAtLeastOneKey = Object.keys(payload).length > 0;
  if (!hasAtLeastOneKey) return null;

  const expressionAttributeValues = {};
  const expressionAttributeNames = {};
  const filterExpression = [];
  let fieldCount = 0;

  Object.keys(payload).forEach((key) => {
    expressionAttributeValues[`:${key}`] = payload[key];
    expressionAttributeNames[`#${key}`] = key;
    filterExpression.push(fieldCount > 0 ? `and #${key} = :${key}` : `#${key} = :${key}`);
    fieldCount += 1;
  });

  return {
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
    FilterExpression: `${filterExpression.join(' ')}`
  };
};

/* Função para gerar parametros para uma DynamoDB.query
Exemplo:
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

filtro['query'].push({ cpf });
filtro['equal'].push({ statusCotacao });
filtro['contains'].push({ nome });
filtro['between'].push({ dataInicio, dataFim, column: 'dataCriacao' });
filtro['contains_nested'].push({ path: ['veiculo', 'modelo'], modelo });
filtro['contains_array'].push({ provedores });

makeDynamicQueryGlobalSecondaryParams(filtro)
*/

exports.makeDynamicQueryGlobalSecondaryParams = (payload) => {
  if (!payload || JsonHelper.isEmpty(payload)) throw new MissingParamError('payload');

  let params = {
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
    FilterExpression: ''
  };

  Object.keys(payload).forEach((key) => {
    for (let i = 0; i < payload[key].length; i++) {
      const [name1, name2, column] = Object.keys(payload[key][i]);

      params.ExpressionAttributeValues[`:${name1}`] = payload[key][i][name1];
      params.ExpressionAttributeNames[`#${name1}`] = `${name1}`;

      if (key == 'equal') {
        params.FilterExpression = params.FilterExpression
          ? params.FilterExpression + ` and #${name1} = :${name1}`
          : ` #${name1} = :${name1}`;
      } else if (key == 'contains') {
        params.FilterExpression = params.FilterExpression
          ? params.FilterExpression + ` and contains(#${name1}, :${name1})`
          : ` contains(#${name1}, :${name1})`;
      } else if (key == 'query') {
        params.IndexName = `${name1}-index`;
        params.KeyConditionExpression = `#${name1} = :${name1}`;
      } else if (key == 'between') {
        delete params.ExpressionAttributeNames[`#${name1}`];
        params.ExpressionAttributeValues[`:${name1}`] = payload[key][i][name1];
        params.ExpressionAttributeValues[`:${name2}`] = payload[key][i][name2];
        params.ExpressionAttributeNames[`#${payload[key][i][column]}`] = `${payload[key][i][column]}`;
        params.FilterExpression = params.FilterExpression
          ? params.FilterExpression + ` and #${payload[key][i][column]} BETWEEN :${name1} and :${name2}`
          : ` #dataCriacao BETWEEN :${name1} and :${name2}`;
      } else if (key == 'page') {
        if (payload[key][i][name1]) params.ExclusiveStartKey = JSON.parse(payload[key][i]);
        delete params.ExpressionAttributeValues[`:${name1}`];
        delete params.ExpressionAttributeNames[`#${name1}`];
      } else if (key == 'limit') {
        delete params.ExpressionAttributeValues[`:${name1}`];
        delete params.ExpressionAttributeNames[`#${name1}`];
        if (payload[key][i][name1]) params.Limit = payload[key][i][name1];
      } else if (key == 'table') {
        delete params.ExpressionAttributeValues[`:${name1}`];
        delete params.ExpressionAttributeNames[`#${name1}`];
        if (payload[key][i][name1]) params.TableName = payload[key][i][name1];
      } else if (key == 'contains_nested') {
        delete params.ExpressionAttributeValues[`:${name1}`];
        delete params.ExpressionAttributeNames[`#${name1}`];
        let expName = '';
        payload[key][i][name1].forEach((name) => {
          params.ExpressionAttributeNames[`#${name}`] = `${name}`;
          expName = expName ? expName + `.#${name}` : `#${name}`;
        });

        params.ExpressionAttributeNames[`#${name2}`] = `${name2}`;
        params.ExpressionAttributeValues[`:${name2}`] = payload[key][i][name2];
        params.FilterExpression = params.FilterExpression
          ? params.FilterExpression + ` and contains(${expName}, :${name2})`
          : ` contains(${expName}, :${name2})`;
      } else if (key == 'contains_array') {
        delete params.ExpressionAttributeValues[`:${name1}`];
        let condition = [];
        for (let j = 0; j < payload[key][i][name1].length; j++) {
          params.ExpressionAttributeValues[`:${name1}${j}`] = payload[key][i][name1][j];
          condition.push(`contains(#${name1}, :${name1}${j})`);
        }

        params.FilterExpression = params.FilterExpression
          ? params.FilterExpression + ` and (${condition.join(' or ')})`
          : ` (${condition.join(' or ')})`;
      }
    }
  });

  if (JsonHelper.isEmpty(params.ExpressionAttributeNames)) delete params.ExpressionAttributeNames;
  if (JsonHelper.isEmpty(params.ExpressionAttributeValues)) delete params.ExpressionAttributeValues;
  if (!params.FilterExpression) delete params.FilterExpression;

  return params;
};

exports.getTotalQueryParams = (payload) => {
  if (!payload || JsonHelper.isEmpty(payload)) throw new MissingParamError('payload');

  if (payload.Limit) delete payload.Limit;
  if (payload.ExclusiveStartKey) delete payload.ExclusiveStartKey;

  payload.Select = 'COUNT';
  return payload;
};
