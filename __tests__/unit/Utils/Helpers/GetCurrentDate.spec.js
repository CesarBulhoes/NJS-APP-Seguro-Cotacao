const { GetCurrentDate } = require('../../../../src/Utils/Helpers');

describe('Considerando o GetCurrentDate', () => {
  describe('E o metodo get é chamdo', () => {
    test('Então espero que isso retorne a data/hoa atual', () => {
      const dataAtual = new Date().toISOString();
      const dataIsoString = GetCurrentDate.get();
      expect(dataIsoString).toContain(dataAtual.split('T')[0]);
    });
  });
});
