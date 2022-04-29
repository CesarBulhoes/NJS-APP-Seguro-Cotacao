const { MissingParamError } = require('../../../../src/Utils/Errors');
const { JsonHelper } = require('../../../../src/Utils/Helpers');

describe('Utils :: Helpers :: JsonHelper', () => {
  describe('Checkando a existencia de Objetos', () => {
    fit('Passando objeto vazio', () => {
      const helper = JsonHelper.isEmpty({});

      expect(helper).toBe(true);
    });

    fit('Passando objeto com conteúdo', () => {
      const helper = JsonHelper.isEmpty({ test: 'teste' });

      expect(helper).toBe(false);
    });
  });
});
