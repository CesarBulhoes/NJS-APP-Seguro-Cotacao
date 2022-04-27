const { MissingParamError } = require('../../../../src/Utils/Errors');

describe('Utils :: Errors :: MissingParamError', () => {
  test('test', () => {
    const error = new MissingParamError('NRC');
    expect(error).toHaveProperty('name', 'MissingParamError');
    expect(error).toHaveProperty('message', 'Missing Param: NRC');
  });
});
