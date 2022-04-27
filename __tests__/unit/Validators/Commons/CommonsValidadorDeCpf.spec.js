const Joi = require('joi');

const { validadorDeCpf } = require('../../../../src/Validators/Commons');

const construirSut = () => {
  const sut = Joi.object({ cpf: validadorDeCpf });

  return {
    sut
  };
};

describe('Considerando o validadorDeCpf', () => {
  const { sut } = construirSut();

  describe('E um CPF invalido é fornecido', () => {
    test('Então espero que isso retorne uma mensagem de CPF invalido', () => {
      const requisicao = { cpf: '00000000000' };

      const { error } = sut.validate(requisicao);
      expect(error.message).toBe('CPF invalido');
    });
  });

  describe('E um CPF valido é fornecido', () => {
    test('Então espero que isso retorne o CPF fornecido', () => {
      const requisicao = { cpf: '54492334009' };

      const { error, value } = sut.validate(requisicao);
      expect(error).toBeFalsy();
      expect(value).toEqual(value);
    });
  });
});
