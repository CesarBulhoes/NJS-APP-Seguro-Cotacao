const Joi = require('joi');

const ConsultarPropostaSchema = Joi.object({
  NRC: Joi.string().required(),
  idProposta: Joi.string()
});

module.exports = ConsultarPropostaSchema;
