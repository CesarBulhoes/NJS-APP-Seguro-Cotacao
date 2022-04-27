const { DYNAMODB_DOCUMENT_CLIENT } = require('../../../src/Config/RecursosAWS');
const { AtualizarCotacaoDAO } = require('../../../src/DAO');
const { MissingParamError } = require('../../../src/Utils/Errors');
const { GetCurrentDate } = require('../../../src/Utils/Helpers');

describe('Cotacao - Aualizar Cotacao Repository', () => {
  const sut = AtualizarCotacaoDAO;

  const updateDateCotacao = {
    idCotacao: '22f6977f-4923-4130-a34c-847876271f84',
    NRC: 'abdcf-abcf-abcf',
    statusCotacao: 'processando',
    dataAtualizacao: GetCurrentDate.get()
  };

  const promise = async () => Promise.resolve({ Attributes: {} });

  const mockResult = {
    promise
  };

  beforeEach(() => {
    jest.spyOn(DYNAMODB_DOCUMENT_CLIENT, 'update').mockImplementation().mockRestore();
  });

  test('Atualizando cotação no DynamoDB', async () => {
    // Mock
    const spyMethod = jest.spyOn(DYNAMODB_DOCUMENT_CLIENT, 'update').mockImplementation(() => mockResult);

    const result = await sut.atualizar(updateDateCotacao);

    // assert
    expect(result.cotacaoId).toBe(sut.cotacaoId);
    expect(spyMethod.mock.calls[0][0].Key.idCotacao).toBe(updateDateCotacao.idCotacao);
    expect(spyMethod.mock.calls[0][0].Key.NRC).toBe(updateDateCotacao.NRC);
  });

  test('tentativa de atualizar a cotação sem seu identificador  - MissingParamError - idCotacao', async () => {
    // assert
    await expect(sut.atualizar({})).rejects.toThrowError(new MissingParamError('NRC'));
  });

  test('tentativa de atualizar a cotação sem o identificar primario de partição  -  MissingParamError  - NRC', async () => {
    // assert
    await expect(sut.atualizar({ NRC: 123 })).rejects.toThrowError(new MissingParamError('idCotacao'));
  });

  test('tentativa de atualizar a cotação - passando payload nulo', async () => {
    // assert
    await expect(sut.atualizar(null)).rejects.toThrowError();
  });
});
