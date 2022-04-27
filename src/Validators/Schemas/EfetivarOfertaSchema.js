const Joi = require('joi');

const {
  EstadoCivilEnum: { SOLTEIRO, CASADO, DIVORCIADO, VIUVO }
} = require('../../Utils/Enums');
const { validadorDeCpf, validadorDeCep } = require('../Commons');

const EfetivarOfertaSchema = Joi.object({
  NRC: Joi.string().required(),
  idCotacao: Joi.string().required(),
  idOferta: Joi.string().required(),
  cpf: validadorDeCpf.required(),
  codigoMetodoPagamento: Joi.string(),
  totalParcelas: Joi.number(),
  codigoChassi: Joi.string(),
  nome: Joi.string(),
  email: Joi.string().email(),
  rendaMensalMedia: Joi.number(),
  ocupacao: Joi.string(),
  codigoOcupacao: Joi.string(),
  sexo: Joi.string(),
  telefone: Joi.string(),
  dataNascimento: Joi.string(),
  estadoCivil: Joi.number().valid(SOLTEIRO, CASADO, DIVORCIADO, VIUVO),
  endereco: Joi.object({
    nomeEndereco: Joi.string(),
    cidade: Joi.string(),
    complemento: Joi.string(),
    bairro: Joi.string(),
    numero: Joi.string(),
    estado: Joi.string(),
    uf: Joi.string(),
    cep: validadorDeCep
  })
});

module.exports = EfetivarOfertaSchema;
