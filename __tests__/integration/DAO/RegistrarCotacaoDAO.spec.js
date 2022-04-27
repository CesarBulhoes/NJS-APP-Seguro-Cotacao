const { DYNAMODB_DOCUMENT_CLIENT } = require('../../../src/Config/RecursosAWS');
const { RegistrarCotacaoDAO } = require('../../../src/DAO');
const { MissingParamError } = require('../../../src/Utils/Errors');

describe('Cotacao - Registrar Cotacao Repository', () => {
  const sut = RegistrarCotacaoDAO;

  // TODO ajustar testes após definição do modelo
  const cotacaoInput = {
    idCotacao: '22f6977f-4923-4130-a34c-847876271f84',
    NRC: 'abdcf-abcf-abcf',
    status: {
      nome: 'completed',
      descricao: 'Comcluido'
    },
    placa: 'ABC123',
    cpf: '48810688066',
    cepPerNoite: '14480-970'
  };

  const promise = async () => Promise.resolve(null);

  const mockResult = {
    promise
  };

  beforeEach(() => {
    jest.spyOn(DYNAMODB_DOCUMENT_CLIENT, 'put').mockImplementation().mockRestore();
  });

  test('Inserindo cotação no DynamoDB', async () => {
    // Mock
    const spyMethod = jest.spyOn(DYNAMODB_DOCUMENT_CLIENT, 'put').mockImplementation(() => mockResult);

    const result = await sut.registrar(cotacaoInput);

    // assert
    expect(result.cotacaoId).toBe(cotacaoInput.cotacaoId);
    expect(spyMethod.mock.calls[0][0].Item).toBe(cotacaoInput);
  });

  test('Inserindo cotação no DynamoDB  -  MissingParamError ', async () => {
    // assert
    await expect(sut.registrar()).rejects.toThrowError(new MissingParamError('NRC'));
  });

  test('Inserindo cotação no DynamoDB -  Exception Error ', async () => {
    // Error Mock
    const errorMock = new Error('Error DynamoDB Mock');
    // Mock
    jest.spyOn(DYNAMODB_DOCUMENT_CLIENT, 'put').mockImplementation(() => {
      throw errorMock;
    });

    // assert
    await expect(sut.registrar(cotacaoInput)).rejects.toThrowError(errorMock);
  });
});
