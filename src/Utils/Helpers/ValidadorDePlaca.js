const { regexPlaca, regexPlacaMercosul } = require('../ExpressoesRegulares');

exports.validar = (placa) => regexPlacaMercosul.test(placa) || regexPlaca.test(placa);
