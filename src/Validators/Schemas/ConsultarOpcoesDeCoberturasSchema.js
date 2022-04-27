const Joi = require('joi');

const ConsultarOpcoesDeCoberturasSchema = Joi.object({
  idOferta: Joi.string().required()
});

module.exports = ConsultarOpcoesDeCoberturasSchema;
