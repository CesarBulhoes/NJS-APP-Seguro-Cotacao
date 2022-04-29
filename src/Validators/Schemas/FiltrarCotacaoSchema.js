const Joi = require('joi');

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const FiltrarCotacaoSchema = Joi.object({
  cpf: Joi.string(),
  cepPernoite: Joi.string(),
  nome: Joi.string(),
  modelo: Joi.string(),
  placa: Joi.string(),
  provedores: Joi.array().items(Joi.string()),
  statusCotacao: Joi.string(),
  dataCriacao: Joi.string(),
  limite: Joi.number(),
  dataInicio: Joi.date(),
  dataFim: Joi.date(),
  pagina: Joi.string().custom((value, helpers) => {
    if (!isJsonString(value)) {
      return helpers.error('any.invalid');
    }

    return value;
  })
});

module.exports = FiltrarCotacaoSchema;
