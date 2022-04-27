const Joi = require('joi');

const { validadorDePlaca } = require('../Commons');

const ConsultarVeiculoSchema = Joi.object({
  placa: validadorDePlaca.required()
});

module.exports = ConsultarVeiculoSchema;
