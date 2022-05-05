const Joi = require('joi');

const ConsultarPdfSchema = Joi.object({
  NRC: Joi.string().required(),
  idProposta: Joi.string().required()
});

module.exports = ConsultarPdfSchema;
