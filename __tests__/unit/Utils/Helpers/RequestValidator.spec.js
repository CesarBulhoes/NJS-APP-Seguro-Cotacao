const { MissingParamError } = require('../../../../src/Utils/Errors');
const { RequestValidator } = require('../../../../src/Utils/Helpers');

describe('Considerando o RequestValidator', () => {
  test('E a dependencia schema não é injetada', () => {
    const dataFake = { qualquerChave: 'qualquerValor' };
    const validator = new RequestValidator();
    const response = () => validator.validate(dataFake);

    expect(response).toThrowError(new Error("Cannot read property 'validate' of undefined"));
  });

  test('E o parametro params não é fornecido', () => {
    const validator = new RequestValidator({ schema: { validate: () => true } });
    const response = () => validator.validate();

    expect(response).toThrowError(new MissingParamError('params'));
  });

  test('E a funcao validate da dependencia schema retorna a propiedade error ', () => {
    const mockValidateFunction = () => ({ error: 'qualquer_error' });
    const validator = new RequestValidator({
      schema: { validate: mockValidateFunction }
    });

    const dataFake = { qualquerChave: 'qualquerValor' };
    const response = validator.validate(dataFake);

    expect(response.erro).toEqual(mockValidateFunction().error);
  });

  test('E a funcao validate da dependencia schema não retorna a propiedade error ', () => {
    const mockValidateFunction = (value) => ({ value });
    const validator = new RequestValidator({
      schema: { validate: mockValidateFunction }
    });

    const dataFake = { qualquerChave: 'qualquerValor' };
    const response = validator.validate(dataFake);

    expect(response.erro).toBeFalsy();
    expect(response.value).toEqual(mockValidateFunction(dataFake).value);
  });
});
