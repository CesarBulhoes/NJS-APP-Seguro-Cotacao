const { MissingParamError } = require('../../../../src/Utils/Errors');
const { DynamodbHelper } = require('../../../../src/Utils/Helpers');

describe('Utils :: Helpers :: DynamodbHelper', () => {
  describe('metodo makeDynamicUpdateParams', () => {
    test('quando não é passado os campos obrigatórios', () => {
      const helper = DynamodbHelper.makeDynamicUpdateParams({ test: 'test' });
      expect(helper).toHaveProperty('ExpressionAttributeValues');
      expect(helper).toHaveProperty('ExpressionAttributeNames');
      expect(helper).toHaveProperty('UpdateExpression');
    });

    test('quando não é passado os dados de entrada', () => {
      expect(() => DynamodbHelper.makeDynamicUpdateParams(null)).toThrowError(new MissingParamError('payload'));
    });

    test('quando um objeto vazio é fornecido', () => {
      const resposta = DynamodbHelper.makeDynamicUpdateParams({});
      expect(resposta).toBeNull();
    });
  });

  describe('metodo makeDynamicScanParams', () => {
    test('quando não é passado os campos obrigatórios', () => {
      const helper = DynamodbHelper.makeDynamicScanParams({ test: 'test' });
      expect(helper).toHaveProperty('ExpressionAttributeValues');
      expect(helper).toHaveProperty('ExpressionAttributeNames');
      expect(helper).toHaveProperty('FilterExpression');
    });

    test('quando não é passado os dados de entrada', () => {
      expect(() => DynamodbHelper.makeDynamicScanParams(null)).toThrowError(new MissingParamError('payload'));
    });

    test('quando um objeto vazio é fornecido', () => {
      const resposta = DynamodbHelper.makeDynamicScanParams({});
      expect(resposta).toBeNull();
    });
  });
});
