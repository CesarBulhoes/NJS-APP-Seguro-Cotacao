const consultarOcupacaoBS = require('../../../src/BS/ConsultarOcupacaoBS');
const { CoreApi } = require('../../../src/Utils/Wiz');

describe('BS :: ConsultarOcupacaoBS', () => {
  describe('#consultar', () => {
    beforeEach(() => {
      jest.spyOn(CoreApi, 'consultarOcupacoes').mockImplementation().mockRestore();
    });

    test('Teste sucesso', async () => {
      jest.spyOn(CoreApi, 'consultarOcupacoes').mockImplementation(() =>
        Promise.resolve([
          { code: '000000', description: 'Não informado' },
          { code: '005252', description: 'Administrador' },
          { code: '003212', description: 'Administrador de bancos de dados' }
        ])
      );

      const result = await consultarOcupacaoBS.consultar();
      expect(result).toHaveProperty('statusCode', 200);
      expect(result).toHaveProperty('body');
    });

    test('Teste sucesso', async () => {
      jest.spyOn(CoreApi, 'consultarOcupacoes').mockImplementation(() => Promise.resolve());

      const result = await consultarOcupacaoBS.consultar();
      expect(result).toHaveProperty('statusCode', 200);
      expect(result).toHaveProperty('body', false);
    });

    test('Teste erro', async () => {
      jest.spyOn(CoreApi, 'consultarOcupacoes').mockImplementation(() => Promise.reject(new Error()));

      const result = await consultarOcupacaoBS.consultar();
      expect(result).toHaveProperty('statusCode', 500);
      expect(result).toHaveProperty('body');
    });
  });
});
