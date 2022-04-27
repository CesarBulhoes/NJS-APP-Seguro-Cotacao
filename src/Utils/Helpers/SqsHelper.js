const { SQS } = require('../../Config/RecursosAWS');

const construirURL = ({ eventSourceARN }) => {
  const [, , , regiao, identificadorDaConta, nomeDaFila] = eventSourceARN.split(':');
  return `https://sqs.${regiao}.amazonaws.com/${identificadorDaConta}/${nomeDaFila}`;
};

const obterNovoTempoLimiteDeVisibilidade = ({ attributes }) => {
  const DEFAULT_VISIBILITY_TIMEOUT = 6;
  const { ApproximateReceiveCount } = attributes;

  let novoTempoLimiteDeVisibilidade = DEFAULT_VISIBILITY_TIMEOUT;
  for (let i = 1; i < ApproximateReceiveCount; i++) novoTempoLimiteDeVisibilidade *= 2;

  return novoTempoLimiteDeVisibilidade;
};

exports.configurarRetentativaExponencial = async ({ Records }) => {
  const respostasSQS = await Promise.allSettled(
    Records.map((record) => {
      const { receiptHandle } = record;
      const queueUrl = construirURL(record);
      const novoTempoLimiteDeVisibilidade = obterNovoTempoLimiteDeVisibilidade(record);

      return SQS.changeMessageVisibility({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
        VisibilityTimeout: novoTempoLimiteDeVisibilidade
      }).promise();
    })
  );

  return respostasSQS;
};
