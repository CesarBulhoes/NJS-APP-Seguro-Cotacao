const { InternalServerError } = require('../../../../src/Utils/Errors');

describe('Utils :: Errors :: InternalServerError', () => {
  test('test', () => {
    const error = new InternalServerError();
    expect(error).toHaveProperty('name', 'InternalServerError');
  });
});
