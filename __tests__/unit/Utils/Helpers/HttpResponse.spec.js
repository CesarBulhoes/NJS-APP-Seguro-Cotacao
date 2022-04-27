const { HttpResponse } = require('../../../../src/Utils/Helpers');

const construirSut = () => ({ sut: HttpResponse });

describe('Considerando o HttpResponse', () => {
  const { sut } = construirSut();

  test('E a função ok é chamada', () => {
    const response = sut.ok({ test: 'Ok Method' });
    expect(response.statusCode).toBe(200);
    expect(response.body.test).toBe('Ok Method');
  });

  test('E a função badRequest é chamada', () => {
    const response = sut.badRequest({ message: 'badRequest' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('badRequest');
  });

  test('E a função notFound é chamda', () => {
    const response = sut.notFound('notFound');
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toContain('notFound');
  });

  test('E a função exceptionHandler é chamada', () => {
    const response = sut.exceptionHandler({ description: 'exceptionHandler', statusCode: 501 });
    expect(response.statusCode).toBe(501);
    expect(response.body.error).toContain('exceptionHandler');
  });
});
