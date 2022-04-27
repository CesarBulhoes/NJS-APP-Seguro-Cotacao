const { NotFoundError } = require('../../../../src/Utils/Errors');

describe('Utils :: Errors :: InternalServerError', () => {
  test('test', () => {
    const error = new NotFoundError();
    expect(error).toHaveProperty('name', 'NotFoundError');
    expect(error).toHaveProperty('statusCode', 404);
  });
});
