const { MissingParamError } = require('../../../../../src/Utils/Errors');
const { AutoApi } = require('../../../../../src/Utils/Wiz');
const { WizAutoHttp } = require('../../../../../src/Utils/Wiz/WizHttp');

const construirSut = () => ({ sut: AutoApi });
const URL_CONSULTAR_DETALHE_COTACAO = 'api/v1.0/quotation';

describe('Considerando o AutoApi', () => {
  describe('E a função consultarDetalheCotacao é chamada', () => {
    test('E o paremetro idCotacao não é fornecido', async () => {
      const { sut } = construirSut();
      const promise = sut.consultarDetalheCotacao(null);

      await expect(promise).rejects.toThrowError(new MissingParamError('idCotacao'));
    });

    test('E a função get de WizAutoHttp lanca um erro', async () => {
      jest.spyOn(WizAutoHttp, 'get').mockImplementation(() => Promise.reject(new Error()));

      const { sut } = construirSut();
      const idCotacaoFake = 'qualquer_idCotacao';
      const promise = sut.consultarDetalheCotacao(idCotacaoFake);

      await expect(promise).rejects.toThrowError(new Error('Erro de integração com o parceiro'));
    });

    test('E o função consultarDetalheCotacao é executada com sucesso', async () => {
      const WizAutoHttpSpy = jest.spyOn(WizAutoHttp, 'get').mockImplementation((data) => {
        WizAutoHttpSpy.mock.calls.push(data);
        return { data: 'qualquer_data' };
      });

      const { sut } = construirSut();
      const idCotacaoFake = 'qualquer_idCotacao';
      const resposta = await sut.consultarDetalheCotacao(idCotacaoFake);

      expect(WizAutoHttpSpy.mock.calls[0][0]).toBe(`${URL_CONSULTAR_DETALHE_COTACAO}/${idCotacaoFake}`);
      expect(resposta).toEqual(WizAutoHttpSpy.mock.results[0].value.data);

      WizAutoHttpSpy.mockRestore();
    });
  });
});
