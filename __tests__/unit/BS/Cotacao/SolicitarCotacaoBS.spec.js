const { SolicitarCotacaoBS } = require('../../../../src/BS/Cotacao');
const { CotacaoDAO, EnviarCotacaoParaFilaDAO } = require('../../../../src/DAO');
const { serialize } = require('../../../../src/Serializers/Cotacao/SolicitarCotacaoSerializer');
const { StatusCotacaoEnum } = require('../../../../src/Utils/Enums');
const { InvalidRequestError, InternalServerError } = require('../../../../src/Utils/Errors');
const { RequestValidator, GetCurrentDate } = require('../../../../src/Utils/Helpers');
const { AutoApi, AutoApiAdapter } = require('../../../../src/Utils/Wiz');

const construirSut = () => ({ sut: SolicitarCotacaoBS });

describe('Considerando o SolicitarCotacaoBS', () => {
  describe('E a funcao solicitar é chamada', () => {
    let dateSpy;
    let validadorSpy;
    let autoApiSolicitarCotacaoSpy;
    let registrarCotacaoDAOSpy;
    let enviarCotacaoParaFilaDAOSpy;

    beforeAll(() => {
      const mockedDate = new Date(2000, 9, 1, 7);
      dateSpy = jest.spyOn(global, 'Date').mockImplementation(() => mockedDate);
    });

    beforeEach(() => {
      validadorSpy = jest.spyOn(RequestValidator.prototype, 'validate').mockImplementation((data) => {
        validadorSpy.mock.calls.push(data);
        return { value: data };
      });

      autoApiSolicitarCotacaoSpy = jest.spyOn(AutoApi, 'solicitarCotacao').mockImplementation((data) => {
        autoApiSolicitarCotacaoSpy.mock.calls.push(data);
        return { quotationRequestId: 'qualquer_id' };
      });

      registrarCotacaoDAOSpy = jest.spyOn(CotacaoDAO, 'registrar').mockImplementation((data) => {
        registrarCotacaoDAOSpy.mock.calls.push(data);
        return {
          ...data,
          statusCotacao: StatusCotacaoEnum.PROCESSANDO,
          dataCriacao: GetCurrentDate.get(),
          dataAtualizacao: GetCurrentDate.get()
        };
      });

      enviarCotacaoParaFilaDAOSpy = jest
        .spyOn(EnviarCotacaoParaFilaDAO, 'enviarParaFila')
        .mockImplementation((data) => enviarCotacaoParaFilaDAOSpy.mock.calls.push(data));
    });

    afterEach(() => {
      validadorSpy.mockRestore();
      autoApiSolicitarCotacaoSpy.mockRestore();
      registrarCotacaoDAOSpy.mockRestore();
      enviarCotacaoParaFilaDAOSpy.mockRestore();
    });

    afterAll(() => dateSpy.mockRestore());

    test('E a função validate de RequestValidator retorne a propiedade erro', async () => {
      const validadorSpyComErro = jest.spyOn(RequestValidator.prototype, 'validate').mockImplementation((data) => {
        validadorSpyComErro.mock.calls.push(data);
        return { erro: 'qualquer_erro' };
      });

      const { sut } = construirSut();
      const fakeData = { invalidKey: 'any_value' };
      const resposta = await sut.solicitar(fakeData);

      expect(validadorSpyComErro).toHaveBeenCalled();
      expect(validadorSpyComErro.mock.calls[0][0]).toEqual(fakeData);
      expect(resposta.statusCode).toBe(400);
      expect(resposta.body).toEqual({
        error: new InvalidRequestError(new RequestValidator().validate(fakeData).erro).message
      });

      validadorSpyComErro.mockRestore();
    });

    test('E a função solicitarCotacao de AutoApi lanca um erro', async () => {
      const autoApiSolicitarCotacaoSpyComErro = jest.spyOn(AutoApi, 'solicitarCotacao').mockImplementation((data) => {
        autoApiSolicitarCotacaoSpyComErro.mock.calls.push(data);
        throw new Error('qualquer erro');
      });

      const { sut } = construirSut();
      const fakeData = {
        provedores: ['qualquer_provedor_01'],
        veiculo: { placa: 'qualquer_placa', modelo: 'qualquer_modelo' },
        cpf: 'qualquer_cpf',
        cepPernoite: 'qualquer_cep'
      };
      const resposta = await sut.solicitar(fakeData);

      expect(autoApiSolicitarCotacaoSpyComErro).toHaveBeenCalled();
      expect(autoApiSolicitarCotacaoSpyComErro.mock.calls[0][0]).toEqual(
        AutoApiAdapter.solicitarCotacaoAdapter(fakeData)
      );
      expect(resposta.statusCode).toBe(500);
      expect(resposta.body).toEqual({ error: new InternalServerError().message });

      autoApiSolicitarCotacaoSpyComErro.mockRestore();
    });

    test('E a função registrar de CotacaoDAO lanca um erro', async () => {
      const registrarCotacaoDAOSpyComErro = jest.spyOn(CotacaoDAO, 'registrar').mockImplementation((data) => {
        registrarCotacaoDAOSpyComErro.mock.calls.push(data);
        throw new Error('qualquer erro');
      });

      const { sut } = construirSut();
      const fakeData = {
        provedores: ['qualquer_provedor_01'],
        veiculo: { placa: 'qualquer_placa', modelo: 'qualquer_modelo' },
        cpf: 'qualquer_cpf',
        cepPernoite: 'qualquer_cep'
      };
      const resposta = await sut.solicitar(fakeData);

      expect(registrarCotacaoDAOSpyComErro).toHaveBeenCalled();
      expect(registrarCotacaoDAOSpyComErro.mock.calls[0][0]).toEqual({
        ...fakeData,
        idCotacao: autoApiSolicitarCotacaoSpy.mock.results[0].value.quotationRequestId,
        statusCotacao: StatusCotacaoEnum.PROCESSANDO,
        dataCriacao: GetCurrentDate.get(),
        dataAtualizacao: GetCurrentDate.get()
      });
      expect(resposta.statusCode).toBe(500);
      expect(resposta.body).toEqual({ error: new InternalServerError().message });

      registrarCotacaoDAOSpyComErro.mockRestore();
    });

    test('E a função enviarParaFila de EnviarCotacaoParaFilaDAO lanca um erro', async () => {
      const enviarCotacaoParaFilaDAOSpyComErro = jest
        .spyOn(EnviarCotacaoParaFilaDAO, 'enviarParaFila')
        .mockImplementation((data) => {
          enviarCotacaoParaFilaDAOSpyComErro.mock.calls.push(data);
          throw new Error('qualquer erro');
        });

      const { sut } = construirSut();
      const fakeData = {
        provedores: ['qualquer_provedor_01'],
        veiculo: { placa: 'qualquer_placa', modelo: 'qualquer_modelo' },
        cpf: 'qualquer_cpf',
        cepPernoite: 'qualquer_cep'
      };
      const resposta = await sut.solicitar(fakeData);

      expect(enviarCotacaoParaFilaDAOSpyComErro).toHaveBeenCalled();
      expect(enviarCotacaoParaFilaDAOSpyComErro.mock.calls[0][0]).toEqual(registrarCotacaoDAOSpy.mock.results[0].value);
      expect(resposta.statusCode).toBe(500);
      expect(resposta.body).toEqual({ error: new InternalServerError().message });

      enviarCotacaoParaFilaDAOSpyComErro.mockRestore();
    });

    test('E a funcao solicitar é executada com sucesso', async () => {
      const { sut } = construirSut();
      const fakeData = {
        provedores: ['qualquer_provedor_01'],
        veiculo: { placa: 'qualquer_placa', modelo: 'qualquer_modelo' },
        cpf: 'qualquer_cpf',
        cepPernoite: 'qualquer_cep'
      };
      const resposta = await sut.solicitar(fakeData);

      expect(resposta.statusCode).toBe(200);
      expect(resposta.body).toEqual(serialize(registrarCotacaoDAOSpy.mock.results[0].value));
    });
  });
});
