const { ValidadorDeCpf } = require('../../../../src/Utils/Helpers');

const construirSut = () => {
  const sut = ValidadorDeCpf;

  return { sut };
};

describe('Considerando o ValidadorDeCpf', () => {
  describe('E um CPF invalido e fornecido', () => {
    const cpfsInvalidos = [['qualquer string'], ['0101010101'], ['00000000000'], ['010101010101'], ['00073558060']];

    test.each(cpfsInvalidos)('Então eu espero que isso retorne false', (cpfInvalido) => {
      const { sut } = construirSut();

      const resposta = sut.validar(cpfInvalido);
      expect(resposta).toBeFalsy();
    });
  });

  describe('E um CPF valido é fornecido', () => {
    test('Então espero que isso retorne true', () => {
      const { sut } = construirSut();
      const cpfValido = '55133149085';

      const resposta = sut.validar(cpfValido);
      expect(resposta).toBeTruthy();
    });
  });
});
