const Joi = require('joi');

const { validadorDeCpf, validadorDePlaca, validadorDeCep } = require('../Commons');

const SolicitarCotacaoSchema = Joi.object({
  NRC: Joi.required(),
  cpf: validadorDeCpf.required(),
  nome: Joi.string().required(),
  email: Joi.string().email(),
  cepPernoite: validadorDeCep.required(),
  provedores: Joi.array().min(1).required(),
  veiculo: Joi.object({
    placa: validadorDePlaca.required(),
    modelo: Joi.string().required()
  })
});

module.exports = SolicitarCotacaoSchema;
