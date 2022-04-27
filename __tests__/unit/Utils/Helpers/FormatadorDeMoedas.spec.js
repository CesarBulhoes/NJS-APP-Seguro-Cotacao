const { FormatadorDeMoedas } = require('../../../../src/Utils/Helpers');

const construirSut = () => {
  const sut = FormatadorDeMoedas;

  return { sut };
};

describe('Considerando o FormatadorDeMoedas', () => {
  describe('E a funcao formatarParaBRL é chamada', () => {
    describe('E o valor fornecido, convertido para Number é NaN', () => {
      const valoresInvalidos = [['1000,5'], ['qualquer string'], [undefined]];

      test.each(valoresInvalidos)('Então eu espero que isso retorne o valor fornecido', (valorInvalido) => {
        const { sut } = construirSut();

        const resposta = sut.formatarParaBRL(valorInvalido);
        expect(resposta).toBe(valorInvalido);
      });
    });

    describe('E o valor fornecido, convertido para Number é diverente de NaN', () => {
      const valoresValidos = [['10000'], ['1000.5'], [20000], [2000.5]];

      test.each(valoresValidos)('Então eu espero que isso retorne o valor fornecido', (valorValido) => {
        const { sut } = construirSut();

        const resposta = sut.formatarParaBRL(valorValido);
        expect(resposta).toBe(Number(valorValido).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }));
      });
    });
  });
});
