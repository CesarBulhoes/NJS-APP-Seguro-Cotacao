const consoleStp = require('libStpInvoke').Console;

const { CallbackSTP } = require('./CallbackSTP');
const { AtualizarCotacaoBS } = require('./src/BS/Cotacao');
const { SqsHelper } = require('./src/Utils/Helpers');

module.exports.execute = async (event, context, callback) => {
  const callbackSTP = new CallbackSTP(event, callback);
  consoleStp.payload({ event });

  const resposta = await AtualizarCotacaoBS.atualizar(JSON.parse(event.Records[0].body));
  if (resposta.statusCode === 200) {
    return callbackSTP.send(null, { dados: resposta.body, status: { codigoRetorno: 0, mensagem: 'Success' } });
  }

  await SqsHelper.configurarRetentativaExponencial(event);
  const mensagem = { status: {} };

  mensagem.status.codigoRetorno = -1;
  mensagem.status.mensagem = 'Erro inesperado no index';
  mensagem.status.error = resposta.body;
  return callbackSTP.send(mensagem);
};
