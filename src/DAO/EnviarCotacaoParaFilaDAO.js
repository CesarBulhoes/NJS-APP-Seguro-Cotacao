const { FILA_COTACAO_SEGUROS_QUEUE_URL } = require('../Config/Env');
const { SQS } = require('../Config/RecursosAWS');
const { MissingParamError } = require('../Utils/Errors');

const construirMensagemSQS = ({ NRC, idCotacao }) => ({
  MessageBody: JSON.stringify({ NRC, idCotacao }),
  QueueUrl: FILA_COTACAO_SEGUROS_QUEUE_URL
});

exports.enviarParaFila = async ({ NRC, idCotacao } = {}) => {
  if (!NRC) throw new MissingParamError('NRC');
  if (!idCotacao) throw new MissingParamError('idCotacao');

  const mensagem = construirMensagemSQS({ NRC, idCotacao });
  return SQS.sendMessage(mensagem).promise();
};
