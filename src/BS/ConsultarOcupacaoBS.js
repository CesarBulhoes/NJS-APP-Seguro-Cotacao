const consoleStp = require('libStpInvoke').Console;

const { HttpResponse } = require('../Utils/Helpers');
const { CoreApi } = require('../Utils/Wiz');

exports.consultar = async () => {
  try {
    const ocupacoes = await CoreApi.consultarOcupacoes();

    consoleStp.payload(ocupacoes);

    const resposta =
      Array.isArray(ocupacoes) &&
      ocupacoes.map((ocupacao) => ({
        codigo: ocupacao.code,
        descricao: ocupacao.description
      }));

    return HttpResponse.ok(resposta);
  } catch (erro) {
    consoleStp.error(erro);
    return HttpResponse.exceptionHandler(erro);
  }
};
