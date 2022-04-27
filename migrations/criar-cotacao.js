const consoleStp = require('libStpInvoke').Console;

const { NOME_DA_TABELA_DE_COTACAO } = require('../src/Config/Env');
const { DYNAMODB } = require('../src/Config/RecursosAWS');

const params = {
  TableName: NOME_DA_TABELA_DE_COTACAO,
  AttributeDefinitions: [
    {
      AttributeName: 'NRC',
      AttributeType: 'S'
    },
    {
      AttributeName: 'idCotacao',
      AttributeType: 'S'
    },
    {
      AttributeName: 'cpf',
      AttributeType: 'S'
    },
    {
      AttributeName: 'statusCotacao',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'NRC',
      KeyType: 'HASH'
    },
    {
      AttributeName: 'idCotacao',
      KeyType: 'RANGE'
    }
  ],
  GlobalSecondaryIndexes: [
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
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    },
    {
      IndexName: 'statusCotacao-index',
      KeySchema: [
        {
          AttributeName: 'statusCotacao',
          KeyType: 'HASH'
        }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

const createTable = async () => {
  const response = await DYNAMODB.createTable(params).promise();
  consoleStp.info(JSON.stringify(response));
};

const deleteTable = async () => {
  const response = await DYNAMODB.deleteTable({ TableName: NOME_DA_TABELA_DE_COTACAO }).promise();
  consoleStp.info(JSON.stringify(response));
};

const handler = () => {
  const operation = process.argv[2];

  if (operation === 'start') return createTable();
  if (operation === 'undo') return deleteTable();

  return consoleStp.info(`Invalid parameter: ${process.argv[2]}`);
};

handler();
