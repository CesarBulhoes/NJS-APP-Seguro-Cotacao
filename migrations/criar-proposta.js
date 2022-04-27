const consoleStp = require('libStpInvoke').Console;

const { NOME_DA_TABELA_DE_PROPOSTA } = require('../src/Config/Env');
const { DYNAMODB } = require('../src/Config/RecursosAWS');

const params = {
  TableName: NOME_DA_TABELA_DE_PROPOSTA,
  AttributeDefinitions: [
    {
      AttributeName: 'NRC',
      AttributeType: 'S'
    },
    {
      AttributeName: 'idProposta',
      AttributeType: 'S'
    },
    {
      AttributeName: 'cpf',
      AttributeType: 'S'
    },
    {
      AttributeName: 'statusProposta',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'NRC',
      KeyType: 'HASH'
    },
    {
      AttributeName: 'idProposta',
      KeyType: 'RANGE'
    }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'idProposta-index',
      KeySchema: [
        {
          AttributeName: 'idProposta',
          KeyType: 'HASH'
        }
      ],
      Projection: {
        ProjectionType: 'ALL'
      }
    },
    {
      IndexName: 'cpf-index',
      KeySchema: [
        {
          AttributeName: 'cpf',
          KeyType: 'HASH'
        }
      ],
      Projection: {
        ProjectionType: 'ALL'
      }
    },
    {
      IndexName: 'statusProposta-index',
      KeySchema: [
        {
          AttributeName: 'statusProposta',
          KeyType: 'HASH'
        }
      ],
      Projection: {
        ProjectionType: 'ALL'
      }
    }
  ],
  BillingMode: 'PAY_PER_REQUEST'
};

const createTable = async () => {
  const response = await DYNAMODB.createTable(params).promise();
  consoleStp.info(JSON.stringify(response));
};

const deleteTable = async () => {
  const response = await DYNAMODB.deleteTable({ TableName: NOME_DA_TABELA_DE_PROPOSTA }).promise();
  consoleStp.info(JSON.stringify(response));
};

const handler = () => {
  const operation = process.argv[2];

  if (operation === 'start') return createTable();
  if (operation === 'undo') return deleteTable();

  return consoleStp.info(`Invalid parameter: ${process.argv[2]}`);
};

handler();
