const Joi = require('joi');

const ConsultarCotacaoSchema = Joi.object({
  NRC: Joi.string().required(),
  idCotacao: Joi.string()
});

module.exports = ConsultarCotacaoSchema;
