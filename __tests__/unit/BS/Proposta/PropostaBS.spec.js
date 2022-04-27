const PropostaBS = require('../../../../src/BS/Proposta/PropostaBS');
const { PropostaDAO } = require('../../../../src/DAO');
const { InvalidRequestError, InternalServerError } = require('../../../../src/Utils/Errors');
const { RequestValidator } = require('../../../../src/Utils/Helpers');

const construirSut = () => ({ sut: PropostaBS });

describe('Considerando o PropostaBS', () => {
  describe('E a função consultarPorChave é chamada', () => {
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

    describe('E a propiedade idProposta é fornecida', () => {
      test('E a função consultarPorChave de PropostaDAO lança um erro', async () => {
        const consultarCotacaoDAOSpyComErro = jest
          .spyOn(PropostaDAO, 'consultarPorChave')
          .mockImplementation((data) => {
            consultarCotacaoDAOSpyComErro.mock.calls.push(data);
            throw new Error('qualquer erro');
          });

        const { sut } = construirSut();
        const fakeData = { NRC: 'qualquer_NRC', idProposta: 'qualquer_idCotacao' };
        const resposta = await sut.consultar(fakeData);

        expect(consultarCotacaoDAOSpyComErro).toHaveBeenCalled();
        expect(consultarCotacaoDAOSpyComErro.mock.calls[0][0]).toEqual(fakeData);
        expect(resposta.statusCode).toBe(500);
        expect(resposta.body).toEqual({ error: new InternalServerError().message });

        consultarCotacaoDAOSpyComErro.mockRestore();
      });

      test('E a função consultarPorChave de PropostaDAO retorna um valor false', async () => {
        const consultarCotacaoDAOSpyRetornaFalse = jest
          .spyOn(PropostaDAO, 'consultarPorChave')
          .mockImplementation(() => false);

        const { sut } = construirSut();
        const fakeData = { NRC: 'qualquer_NRC', idProposta: 'qualquer_idCotacao' };
        const resposta = await sut.consultar(fakeData);

        expect(resposta.statusCode).toBe(200);
        expect(resposta.body).toEqual({});

        consultarCotacaoDAOSpyRetornaFalse.mockRestore();
      });

      test('E a função consultarPorChave de PropostaDAO retorna uma cotacao', async () => {
        const consultarCotacaoDAOSpy = jest
          .spyOn(PropostaDAO, 'consultarPorChave')
          .mockImplementation(() => ({ foo: 'bar' }));

        const { sut } = construirSut();
        const fakeData = { NRC: 'qualquer_NRC', idProposta: 'qualquer_idCotacao' };
        const resposta = await sut.consultar(fakeData);

        expect(resposta.statusCode).toBe(200);
        expect(resposta.body).toEqual(consultarCotacaoDAOSpy.mock.results[0].value);

        consultarCotacaoDAOSpy.mockRestore();
      });
    });

    describe('E a propiedade idProposta não é fornecida', () => {
      test('E a função listar de PropostaDAO lança um erro', async () => {
        const ListarCotacaoDAOSpyComErro = jest.spyOn(PropostaDAO, 'consultarPorNRC').mockImplementation((data) => {
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

      test('E a função listar de PropostaDAO é executada com sucesso', async () => {
        const ListarCotacaoDAOSpy = jest.spyOn(PropostaDAO, 'consultarPorNRC').mockImplementation((data) => {
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
        expect(resposta.body).toEqual(ListarCotacaoDAOSpy.mock.results[0].value);

        ListarCotacaoDAOSpy.mockRestore();
      });
    });
  });
});
