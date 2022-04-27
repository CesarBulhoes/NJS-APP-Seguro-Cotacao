const Joi = require('joi');

const { cepRegex } = require('../../Utils/ExpressoesRegulares');
const { ValidadorDePlaca, ValidadorDeCpf } = require('../../Utils/Helpers');

const validadorDePlaca = Joi.string()
  .trim()
  .custom((value, helper) => {
    if (ValidadorDePlaca.validar(value)) return value;
    return helper.message('Placa invalida');
  });

const validadorDeCpf = Joi.string()
  .trim()
  .custom((value, helper) => {
    if (ValidadorDeCpf.validar(value)) return value;
    return helper.message('CPF invalido');
  });

const validadorDeCep = Joi.string().pattern(cepRegex).messages({
  'string.pattern.base': 'CEP invalido'
});

module.exports = {
  validadorDePlaca,
  validadorDeCpf,
  validadorDeCep
};
