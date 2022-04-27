const { MissingParamError } = require('../../../../../src/Utils/Errors');
const { AutoApi } = require('../../../../../src/Utils/Wiz');
const { WizAutoHttp } = require('../../../../../src/Utils/Wiz/WizHttp');

const construirSut = () => ({ sut: AutoApi });
const URL_EFETIVAR_OFERTA = 'api/v1.0/proposal';

describe('Considerando o AutoApi', () => {
  describe('E a função efetivarOferta é chamada', () => {
    test('E o paremetro offerId não é fornecido', async () => {
      const { sut } = construirSut();
      const promise = sut.efetivarOferta({});

      await expect(promise).rejects.toThrowError(new MissingParamError('offerId'));
    });

    test('E a função put de WizAutoHttp lanca um erro', async () => {
      jest.spyOn(WizAutoHttp, 'put').mockImplementation(() => Promise.reject(new Error()));

      const { sut } = construirSut();
      const requisicao = {
        offerId: 'qualquer_offerId',
        qualquer_chave: 'qualquer_valor'
      };
      const promise = sut.efetivarOferta(requisicao);

      await expect(promise).rejects.toThrowError(new Error('Erro de integração com o parceiro'));
    });

    test('E o função solicitarCotacao é executada com sucesso', async () => {
      const WizAutoHttpSpy = jest.spyOn(WizAutoHttp, 'put').mockImplementation((data) => {
        WizAutoHttpSpy.mock.calls.push(data);
        return { data: 'qualquer_data' };
      });

      const { sut } = construirSut();
      const requisicao = {
        offerId: 'qualquer_offerId',
        qualquer_chave: 'qualquer_valor'
      };
      const resposta = await sut.efetivarOferta(requisicao);

      const { offerId, ...payload } = requisicao;
      expect(WizAutoHttpSpy.mock.calls[0][0]).toEqual(`${URL_EFETIVAR_OFERTA}/${offerId}`);
      expect(WizAutoHttpSpy.mock.calls[0][1]).toEqual(payload);
      expect(resposta).toEqual(WizAutoHttpSpy.mock.results[0].value.data);

      WizAutoHttpSpy.mockRestore();
    });
  });
});
