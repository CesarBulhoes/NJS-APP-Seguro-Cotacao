const { CoreApi } = require('../../../../../src/Utils/Wiz');
const { WizCoreHttp } = require('../../../../../src/Utils/Wiz/WizHttp');

const construirSut = () => ({ sut: CoreApi });
const URL_CONSULTAR_OCUPACOES = 'api/v1.0/domaintypes/occupations';

describe('Considerando o CoreApi', () => {
  describe('E a função consultarOcupacoes é chamada', () => {
    test('E a função get de WizCoreHttp lanca um erro', async () => {
      const WizCoreHttpSpy = jest.spyOn(WizCoreHttp, 'get').mockImplementation(() => Promise.reject(new Error()));

      const { sut } = construirSut();
      const promise = sut.consultarOcupacoes();

      await expect(promise).rejects.toThrowError(new Error('Erro de integração com o parceiro'));

      WizCoreHttpSpy.mockRestore();
    });

    test('E o função consultarOcupacoes é executada com sucesso', async () => {
      const WizCoreHttpSpy = jest.spyOn(WizCoreHttp, 'get').mockImplementation((data) => {
        WizCoreHttpSpy.mock.calls.push(data);
        return { data: 'qualquer_data' };
      });

      const { sut } = construirSut();
      const resposta = await sut.consultarOcupacoes();

      expect(WizCoreHttpSpy.mock.calls[0][0]).toBe(URL_CONSULTAR_OCUPACOES);
      expect(resposta).toEqual(WizCoreHttpSpy.mock.results[0].value.data);

      WizCoreHttpSpy.mockRestore();
    });
  });
});
