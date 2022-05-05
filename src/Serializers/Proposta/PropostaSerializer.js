const { CodigosCoberturasWizEnum } = require('../../Utils/Enums');

const ordemCoberturas = {
  veiculo: 0,
  [CodigosCoberturasWizEnum.DANOS_MATERIAIS]: 1,
  [CodigosCoberturasWizEnum.DANOS_CORPORAIS]: 2,
  [CodigosCoberturasWizEnum.CASCO]: 3,
  [CodigosCoberturasWizEnum.MORTE]: 4,
  [CodigosCoberturasWizEnum.INVALIDEZ_PERMANENTE]: 5,
  [CodigosCoberturasWizEnum.DANOS_MORAIS]: 6,
  [CodigosCoberturasWizEnum.GUINCHO_SEM_LIMITE]: 7,
  [CodigosCoberturasWizEnum.CARRO_RESERVA]: 8,
  [CodigosCoberturasWizEnum.HDI_AUTO_VIDROS]: 9
};

const ordenarCoberturas = (coberturas) => {
  if (!coberturas) return;

  const regraDeOrdenacao = (cobertura, coberturaComparacao) =>
    ordemCoberturas[cobertura.codigo] - ordemCoberturas[coberturaComparacao.codigo];

  coberturas.forEach((cobertura) => {
    cobertura.garantias.sort(regraDeOrdenacao);
    cobertura.adicionais.sort(regraDeOrdenacao);
  });
};

const serialize = ({
  idProposta,
  idCotacao,
  idOferta,
  statusProposta,
  nome,
  cpf,
  email,
  sexo,
  telefone,
  dataNascimento,
  estadoCivil,
  rendaMensalMedia,
  ocupacao,
  codigoOcupacao,
  endereco,
  valorLiquidoPremio,
  iof,
  valorPremio,
  codigoMetodoPagamento,
  totalParcelas,
  codigoChassi,
  veiculo,
  nomeProvedor,
  coberturas,
  dataCriacao,
  dataAtualizacao,
  pdf
}) => {
  ordenarCoberturas(coberturas);

  return {
    idProposta,
    idCotacao,
    idOferta,
    statusProposta,
    nome,
    cpf,
    email,
    sexo,
    telefone,
    dataNascimento,
    estadoCivil,
    rendaMensalMedia,
    ocupacao,
    codigoOcupacao,
    endereco,
    valorLiquidoPremio,
    iof,
    valorPremio,
    codigoMetodoPagamento,
    totalParcelas,
    codigoChassi,
    veiculo,
    nomeProvedor,
    coberturas,
    dataCriacao,
    dataAtualizacao,
    pdf
  };
};

const serializeLista = (propostas) => propostas.map((proposta) => serialize(proposta));

module.exports = {
  serialize,
  serializeLista
};
