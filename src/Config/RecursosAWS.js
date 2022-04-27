const AWS = require('aws-sdk');

const { REGION, DYNAMODB_ENDPOINT } = require('./Env');

const DYNAMODB = new AWS.DynamoDB({
  endpoint: DYNAMODB_ENDPOINT,
  region: REGION
});

const DYNAMODB_DOCUMENT_CLIENT = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  endpoint: DYNAMODB_ENDPOINT,
  region: REGION
});

const SQS = new AWS.SQS({
  apiVersion: '2012-11-05',
  region: REGION
});

module.exports = {
  DYNAMODB,
  DYNAMODB_DOCUMENT_CLIENT,
  SQS
};
