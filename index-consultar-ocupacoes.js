const { CallbackSTP } = require('./CallbackSTP');
const consultarOcupacaoBS = require('./src/BS/ConsultarOcupacaoBS');

module.exports.execute = async (event, context, callback) => {
  const callbackSTP = new CallbackSTP(event, callback);

  const resposta = await consultarOcupacaoBS.consultar(event);
  if (resposta.statusCode === 200) {
    return callbackSTP.send(null, { dados: resposta.body, status: { codigoRetorno: 0, mensagem: 'Success' } });
  }

  const mensagem = { status: {} };

  mensagem.status.codigoRetorno = -1;
  mensagem.status.mensagem = 'Erro inesperado no index';
  mensagem.status.error = resposta;
  return callbackSTP.send(mensagem);
};
