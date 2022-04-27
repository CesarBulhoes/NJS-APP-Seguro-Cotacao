const Joi = require('joi');

const { validadorDePlaca } = require('../../../../src/Validators/Commons');

const construirSut = () => {
  const sut = Joi.object({ placa: validadorDePlaca });

  return {
    sut
  };
};

describe('Considerando o validadorDePlaca', () => {
  const { sut } = construirSut();

  describe('E uma placa invalida é fornecida', () => {
    test('Então espero que isso retorne uma mensagem de Placa invalido', () => {
      const requisicao = { placa: 'a1b2c3' };

      const { error } = sut.validate(requisicao);
      expect(error.message).toBe('Placa invalida');
    });
  });

  describe('E uma placa valida é fornecida', () => {
    test('Então espero que isso retorne uma mensagem de Placa invalido', () => {
      const requisicao = { placa: 'MJN4967' };

      const { error, value } = sut.validate(requisicao);
      expect(error).toBeFalsy();
      expect(value).toEqual(value);
    });
  });
});
