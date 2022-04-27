const { ConflictError } = require('../../../../src/Utils/Errors');

describe('Utils :: Errors :: ConflictError', () => {
  test('test', () => {
    const error = new ConflictError();
    expect(error).toHaveProperty('name', 'ConflictError');
    expect(error).toHaveProperty('statusCode', 409);
  });
});
