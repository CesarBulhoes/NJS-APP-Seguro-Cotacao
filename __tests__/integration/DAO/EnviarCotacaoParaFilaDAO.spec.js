const { SQS } = require('../../../src/Config/RecursosAWS');
const { EnviarCotacaoParaFilaDAO } = require('../../../src/DAO');
const { MissingParamError } = require('../../../src/Utils/Errors');

describe('Cotacao -  Enviar Cotação para Fila - SQS', () => {
  const sut = EnviarCotacaoParaFilaDAO;

  const promise = async () => ({
    ResponseMetadata: { RequestId: '00000000-0000-0000-0000-000000000000' },
    MD5OfMessageBody: 'a16053bcbe63486ed7a7787fd2ef8899',
    MessageId: '22f6977f-4923-4130-a34c-847876271f84'
  });

  const sqsResponse = {
    promise
  };

  const requisicao = {
    idCotacao: 'qualquer_idCotacao',
    NRC: 'qualquer_NRC'
  };

  beforeEach(() => {
    jest.spyOn(SQS, 'sendMessage').mockImplementation().mockRestore();
  });

  test('Enviando para Fila com Sucesso', async () => {
    // Mock
    const spyMethod = jest.spyOn(SQS, 'sendMessage').mockImplementation(() => sqsResponse);

    const result = await sut.enviarParaFila(requisicao);

    // assert
    const { MessageId } = await sqsResponse.promise();
    expect(result.MessageId).toBe(MessageId);
    expect(spyMethod.mock.calls[0][0].MessageBody).toContain(requisicao.idCotacao);
    expect(spyMethod.mock.calls[0][0].MessageBody).toContain(requisicao.NRC);
  });

  test('Enviando para Fila  -  Com Exception', async () => {
    // Error Mock
    const errorMock = new Error('Mock Error');

    // Mock
    jest.spyOn(SQS, 'sendMessage').mockImplementation(() => {
      throw errorMock;
    });

    // assert
    await expect(sut.enviarParaFila(requisicao)).rejects.toThrowError(errorMock);
  });

  test('Enviando para Fila  -  MissingParamError', async () => {
    // assert
    await expect(sut.enviarParaFila({ NRC: {} })).rejects.toThrowError(new MissingParamError('idCotacao'));
    await expect(sut.enviarParaFila({ idCotacao: {} })).rejects.toThrowError(new MissingParamError('NRC'));
  });
});
