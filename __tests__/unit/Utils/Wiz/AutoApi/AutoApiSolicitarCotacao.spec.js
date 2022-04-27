const { MissingParamError } = require('../../../../../src/Utils/Errors');
const { AutoApi } = require('../../../../../src/Utils/Wiz');
const { WizAutoHttp } = require('../../../../../src/Utils/Wiz/WizHttp');

const construirSut = () => ({ sut: AutoApi });
const URL_SUBMETER_COTACAO = 'api/v1.0/quotation';

describe('Considerando o AutoApi', () => {
  describe('E a função solicitarCotacao é chamada', () => {
    test('E o paremetro idCotacao não é fornecido', async () => {
      const { sut } = construirSut();
      const promise = sut.solicitarCotacao(null);

      await expect(promise).rejects.toThrowError(new MissingParamError('payload'));
    });

    test('E a função get de WizAutoHttp lanca um erro', async () => {
      jest.spyOn(WizAutoHttp, 'put').mockImplementation(() => Promise.reject(new Error()));

      const { sut } = construirSut();
      const payloadFake = 'qualquer_payload';
      const promise = sut.solicitarCotacao(payloadFake);

      await expect(promise).rejects.toThrowError(new Error('Erro de integração com o parceiro'));
    });

    test('E o função solicitarCotacao é executada com sucesso', async () => {
      const WizAutoHttpSpy = jest.spyOn(WizAutoHttp, 'put').mockImplementation((data) => {
        WizAutoHttpSpy.mock.calls.push(data);
        return { data: 'qualquer_data' };
      });

      const { sut } = construirSut();
      const payloadFake = 'qualquer_payload';
      const resposta = await sut.solicitarCotacao(payloadFake);

      expect(WizAutoHttpSpy.mock.calls[0][0]).toEqual(`${URL_SUBMETER_COTACAO}`);
      expect(WizAutoHttpSpy.mock.calls[0][1]).toEqual(payloadFake);
      expect(resposta).toEqual(WizAutoHttpSpy.mock.results[0].value.data);

      WizAutoHttpSpy.mockRestore();
    });
  });
});
