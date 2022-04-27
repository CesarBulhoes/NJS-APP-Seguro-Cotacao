const consoleStp = require('libStpInvoke').Console;

const { CallbackSTP } = require('./CallbackSTP');
const { FiltrarCotacaoBS } = require('./src/BS/Cotacao');

module.exports.execute = async (event, context, callback) => {
  const callbackSTP = new CallbackSTP(event, callback);
  consoleStp.payload({ event });
  const data = { ...event.data, NRC: event.headers.codigocliente, ...event.query };

  const resposta = await FiltrarCotacaoBS.filtrar(data);
  if (resposta.statusCode === 200) {
    return callbackSTP.send(null, { dados: resposta.body, status: { codigoRetorno: 0, mensagem: 'Success' } });
  }
  const mensagem = { status: {} };
  mensagem.status.codigoRetorno = -1;
  mensagem.status.mensagem = 'Erro inesperado no index';
  mensagem.status.error = resposta;
  return callbackSTP.send(mensagem);
};
