const Joi = require('joi');

const { validadorDeCep } = require('../../../../src/Validators/Commons');

const construirSut = () => {
  const sut = Joi.object({ cep: validadorDeCep });

  return {
    sut
  };
};

describe('Considerando o validadorDeCep', () => {
  const { sut } = construirSut({ cep: validadorDeCep });

  describe('E um CEP invalido é fornecido', () => {
    test('Então espero que isso retorne uma mensagem de CEP invalido', () => {
      const requisicao = { cep: 'abcd123' };

      const { error } = sut.validate(requisicao);
      expect(error.message).toBe('CEP invalido');
    });
  });

  describe('E um CEP valido é fornecido', () => {
    test('Então espero que isso retorne o CEP fornecido', () => {
      const requisicao = { cep: '18071-772' };

      const { error, value } = sut.validate(requisicao);
      expect(error).toBeFalsy();
      expect(value).toEqual(requisicao);
    });
  });
});
