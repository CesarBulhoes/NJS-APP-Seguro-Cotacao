const { MissingParamError } = require('../../../../../src/Utils/Errors');
const { AutoApi } = require('../../../../../src/Utils/Wiz');
const { WizAutoHttp } = require('../../../../../src/Utils/Wiz/WizHttp');

const construirSut = () => ({ sut: AutoApi });
const URL_CUNSULTAR_OFERTA = 'api/v1.0/offer';

describe('Considerando o AutoApi', () => {
  describe('E a função consultarOferta é chamada', () => {
    test('E o paremetro idOferta não é fornecido', async () => {
      const { sut } = construirSut();
      const promise = sut.consultarOferta(null);

      await expect(promise).rejects.toThrowError(new MissingParamError('idOferta'));
    });

    test('E a função get de WizAutoHttp lanca um erro', async () => {
      jest.spyOn(WizAutoHttp, 'get').mockImplementation(() => Promise.reject(new Error()));

      const { sut } = construirSut();
      const ofertaFake = 'qualquer_idOferta';
      const promise = sut.consultarOferta(ofertaFake);

      await expect(promise).rejects.toThrowError(new Error('Erro de integração com o parceiro'));
    });

    test('E o função consultarOferta é executada com sucesso', async () => {
      const WizAutoHttpSpy = jest.spyOn(WizAutoHttp, 'get').mockImplementation((data) => {
        WizAutoHttpSpy.mock.calls.push(data);
        return { data: 'qualquer_data' };
      });

      const { sut } = construirSut();
      const ofertaFake = 'qualquer_idOferta';
      const resposta = await sut.consultarOferta(ofertaFake);

      expect(WizAutoHttpSpy.mock.calls[0][0]).toBe(`${URL_CUNSULTAR_OFERTA}/${ofertaFake}`);
      expect(resposta).toEqual(WizAutoHttpSpy.mock.results[0].value.data);

      WizAutoHttpSpy.mockRestore();
    });
  });
});
