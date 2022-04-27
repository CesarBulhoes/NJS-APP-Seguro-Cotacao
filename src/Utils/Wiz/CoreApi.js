const consoleStp = require('libStpInvoke').Console;

const errorClient = require('../ErrorClient');
const { WizCoreHttp } = require('./WizHttp');

const URL_CONSULTAR_OCUPACOES = 'api/v1.0/domaintypes/occupations';

exports.consultarOcupacoes = async () => {
  try {
    const result = await WizCoreHttp.get(URL_CONSULTAR_OCUPACOES);

    return result.data;
  } catch (erro) {
    consoleStp.error(`Erro API externa: ${errorClient(erro)}`);
    throw new Error('Erro de integração com o parceiro');
  }
};
