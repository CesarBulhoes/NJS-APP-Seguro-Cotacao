const { ConsultarCotacaoBS } = require('../../../../src/BS/Cotacao');
const { CotacaoDAO } = require('../../../../src/DAO');
const { serializeLista, serialize } = require('../../../../src/Serializers/Cotacao/ConsultarCotacaoSerializer');
const { InvalidRequestError, InternalServerError } = require('../../../../src/Utils/Errors');
const { RequestValidator } = require('../../../../src/Utils/Helpers');

const construirSut = () => ({ sut: ConsultarCotacaoBS });

describe('Considerando o SolicitarCotacaoBS', () => {
  describe('E a função consultar é chamada', () => {
    let validadorSpy;

    beforeEach(() => {
      validadorSpy = jest.spyOn(RequestValidator.prototype, 'validate').mockImplementation((data) => {
        validadorSpy.mock.calls.push(data);
        return { value: data };
      });
    });

    afterEach(() => {
      validadorSpy.mockRestore();
    });

    test('E a função validate de RequestValidator retorna a propiedade erro', async () => {
      const validadorSpyComErro = jest.spyOn(RequestValidator.prototype, 'validate').mockImplementation((data) => {
        validadorSpyComErro.mock.calls.push(data);
        return { erro: 'qualquer_erro' };
      });

      const { sut } = construirSut();
      const fakeData = { invalidKey: 'any_value' };
      const resposta = await sut.consultar(fakeData);

      expect(validadorSpyComErro).toHaveBeenCalled();
      expect(validadorSpyComErro.mock.calls[0][0]).toEqual(fakeData);
      expect(resposta.statusCode).toBe(400);
      expect(resposta.body).toEqual({
        error: new InvalidRequestError(new RequestValidator().validate(fakeData).erro).message
      });

      validadorSpyComErro.mockRestore();
    });

    describe('E a propiedade idCotacao é fornecida', () => {
      test('E a função consultar de CotacaoDAO lança um erro', async () => {
        const consultarCotacaoDAOSpyComErro = jest.spyOn(CotacaoDAO, 'consultar').mockImplementation((data) => {
          consultarCotacaoDAOSpyComErro.mock.calls.push(data);
          throw new Error('qualquer erro');
        });

        const { sut } = construirSut();
        const fakeData = { NRC: 'qualquer_NRC', idCotacao: 'qualquer_idCotacao' };
        const resposta = await sut.consultar(fakeData);

        expect(consultarCotacaoDAOSpyComErro).toHaveBeenCalled();
        expect(consultarCotacaoDAOSpyComErro.mock.calls[0][0]).toEqual(fakeData);
        expect(resposta.statusCode).toBe(500);
        expect(resposta.body).toEqual({ error: new InternalServerError().message });

        consultarCotacaoDAOSpyComErro.mockRestore();
      });

      test('E a função consultar de CotacaoDAO retorna um valor false', async () => {
        const consultarCotacaoDAOSpyRetornaFalse = jest.spyOn(CotacaoDAO, 'consultar').mockImplementation(() => false);

        const { sut } = construirSut();
        const fakeData = { NRC: 'qualquer_NRC', idCotacao: 'qualquer_idCotacao' };
        const resposta = await sut.consultar(fakeData);

        expect(resposta.statusCode).toBe(200);
        expect(resposta.body).toEqual({});

        consultarCotacaoDAOSpyRetornaFalse.mockRestore();
      });

      test('E a função consultar de CotacaoDAO retorna uma cotacao', async () => {
        const consultarCotacaoDAOSpy = jest.spyOn(CotacaoDAO, 'consultar').mockImplementation(() => ({ foo: 'bar' }));

        const { sut } = construirSut();
        const fakeData = { NRC: 'qualquer_NRC', idCotacao: 'qualquer_idCotacao' };
        const resposta = await sut.consultar(fakeData);

        expect(resposta.statusCode).toBe(200);
        expect(resposta.body).toEqual(serialize(consultarCotacaoDAOSpy.mock.results[0].value));

        consultarCotacaoDAOSpy.mockRestore();
      });
    });

    describe('E a propiedade idCotacao não é fornecida', () => {
      test('E a função listar de CotacaoDAO lança um erro', async () => {
        const ListarCotacaoDAOSpyComErro = jest.spyOn(CotacaoDAO, 'consultarPorNRC').mockImplementation((data) => {
          ListarCotacaoDAOSpyComErro.mock.calls.push(data);
          throw new Error('qualquer erro');
        });

        const { sut } = construirSut();
        const fakeData = { NRC: 'qualquer_NRC' };
        const resposta = await sut.consultar(fakeData);

        expect(ListarCotacaoDAOSpyComErro).toHaveBeenCalled();
        expect(ListarCotacaoDAOSpyComErro.mock.calls[0][0]).toEqual(fakeData);
        expect(resposta.statusCode).toBe(500);
        expect(resposta.body).toEqual({ error: new InternalServerError().message });

        ListarCotacaoDAOSpyComErro.mockRestore();
      });

      test('E a função consultarPorNRC de CotacaoDAO retorna um array vazio', async () => {
        const consultarCotacaoDAOSpyRetornaFalse = jest
          .spyOn(CotacaoDAO, 'consultarPorNRC')
          .mockImplementation(() => []);

        const { sut } = construirSut();
        const fakeData = { NRC: 'qualquer_NRC' };
        const resposta = await sut.consultar(fakeData);

        expect(resposta.statusCode).toBe(200);
        expect(resposta.body).toEqual([]);

        consultarCotacaoDAOSpyRetornaFalse.mockRestore();
      });

      test('E a função listar de CotacaoDAO é executada com sucesso', async () => {
        const ListarCotacaoDAOSpy = jest.spyOn(CotacaoDAO, 'consultarPorNRC').mockImplementation((data) => {
          ListarCotacaoDAOSpy.mock.calls.push(data);
          return [
            { dataCriacao: new Date(2017, 2, 7) },
            { dataCriacao: new Date(2019, 2, 7) },
            { dataCriacao: new Date(2018, 2, 7) }
          ];
        });

        const { sut } = construirSut();
        const fakeData = { NRC: 'qualquer_NRC' };
        const resposta = await sut.consultar(fakeData);

        expect(ListarCotacaoDAOSpy).toHaveBeenCalled();
        expect(ListarCotacaoDAOSpy.mock.calls[0][0]).toEqual(fakeData);
        expect(resposta.statusCode).toBe(200);
        expect(resposta.body).toEqual(serializeLista(ListarCotacaoDAOSpy.mock.results[0].value));

        ListarCotacaoDAOSpy.mockRestore();
      });
    });
  });
});
