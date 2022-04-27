const { MissingParamError } = require('../../../../../src/Utils/Errors');
const { AutoApi } = require('../../../../../src/Utils/Wiz');
const { WizAutoHttp } = require('../../../../../src/Utils/Wiz/WizHttp');

const construirSut = () => ({ sut: AutoApi });
const URL_BUSCAR_VEICULO = 'api/v1.0/common/vehicles/search';

describe('Considerando o AutoApi', () => {
  describe('E a função buscarVeiculo é chamada', () => {
    test('E o paremetro placa não é fornecido', async () => {
      const { sut } = construirSut();
      const promise = sut.buscarVeiculo(null);

      await expect(promise).rejects.toThrowError(new MissingParamError('placa'));
    });

    test('E a função get de WizAutoHttp lanca um erro', async () => {
      jest.spyOn(WizAutoHttp, 'get').mockImplementation(() => Promise.reject(new Error()));

      const { sut } = construirSut();
      const placaFake = 'qualquer_placa';
      const promise = sut.buscarVeiculo(placaFake);

      await expect(promise).rejects.toThrowError(new Error('Erro de integração com o parceiro'));
    });

    test('E o função buscarVeiculo é executada com sucesso', async () => {
      const WizAutoHttpSpy = jest.spyOn(WizAutoHttp, 'get').mockImplementation((data) => {
        WizAutoHttpSpy.mock.calls.push(data);
        return { data: 'qualquer_data' };
      });

      const { sut } = construirSut();
      const placaFake = 'qualquer_placa';
      const resposta = await sut.buscarVeiculo(placaFake);

      expect(WizAutoHttpSpy.mock.calls[0][0]).toBe(`${URL_BUSCAR_VEICULO}/${placaFake}`);
      expect(resposta).toEqual(WizAutoHttpSpy.mock.results[0].value.data);

      WizAutoHttpSpy.mockRestore();
    });
  });
});
