const objectMapper = require('object-mapper');

const { CodigosCoberturasWizEnum } = require('../../Utils/Enums');
const {
  FormatadorDeMoedas: { formatarParaBRL }
} = require('../../Utils/Helpers');

const ofertasSerializerConfig = {
  id: 'idOferta',
  createDate: 'dataCriacao',
  updateDate: 'dataAtualizacao',
  'provider.name': 'nomeProvedor',
  insuranceNetPremium: 'valorLiquidoPremio',
  insurancePremium: 'valorPremio',
  iof: 'iof',
  'paymentMethods[].type.id': 'meioPagamento[].tipo.id',
  'paymentMethods[].type.name': 'meioPagamento[].tipo.nome',
  'paymentMethods[].type.description': 'meioPagamento[].tipo.descricao',
  'paymentMethods[].description': 'meioPagamento[].descricao',
  'paymentMethods[].code': 'meioPagamento[].codigo',
  'paymentMethods[].installmentOptions[].description': 'meioPagamento[].opcoesParcelamento[].descricao',
  'paymentMethods[].installmentOptions[].totalAmount': 'meioPagamento[].opcoesParcelamento[].valorTotal',
  'paymentMethods[].installmentOptions[].interestAmount': 'meioPagamento[].opcoesParcelamento[].montanteJuros',
  'paymentMethods[].installmentOptions[].iof': 'meioPagamento[].opcoesParcelamento[].iof',

  'paymentMethods[].installmentOptions[].valueOfTheFirstInstallment':
    'meioPagamento[].opcoesParcelamento[].valorPrimeiraParcela',

  'paymentMethods[].installmentOptions[].valueOfTheLastInstallment':
    'meioPagamento[].opcoesParcelamento[].valorUltimaParcela',

  'paymentMethods[].installmentOptions[].totalOfInstallments':
    'meioPagamento[].opcoesParcelamento[].numeroTotalParcelas'
};

const rejeicoesSerializerConfig = {
  createDate: 'dataCriacao',
  providerName: 'nomeProvedor',
  reasons: 'razoes'
};

const dadosSerializerConfig = {
  code: 'codigo',
  id: 'id',
  quotationDate: 'dataCotacao',
  quotationDueDate: 'dataExpiracaoCotacao',
  startDate: 'dataInicio',
  endDate: 'dataFim',
  insuranceNetPremium: 'valorLiquidoPremio',
  insurancePremium: 'valorPremio',
  iof: 'iof',
  'vehicle.chassisCode': 'veiculo.codigoChassis',
  'vehicle.branch': 'veiculo.marca',
  'vehicle.code': 'veiculo.codigo',
  'vehicle.model': 'veiculo.modelo',
  'vehicle.color': 'veiculo.cor',
  'vehicle.description': 'veiculo.descricao',
  'vehicle.category': 'veiculo.categoria',
  'vehicle.fuel': 'veiculo.combustivel',
  'vehicle.manufactureYear': 'veiculo.dataFabricacao',
  'vehicle.modelYear': 'veiculo.anoModelo',
  'vehicle.plate': 'veiculo.placa',
  'vehicle.age': 'veiculo.idade',
  fipePercentageUsed: 'fipePercentualusado',
  'overnightStay.zipcode': 'localEstadiaPernoite.cep',
  'overnightStay.addressName': 'localEstadiaPernoite.nomeEndereco',
  'overnightStay.complement': 'localEstadiaPernoite.complemento',
  'overnightStay.neighborhood': 'localEstadiaPernoite.bairro',
  'overnightStay.city': 'localEstadiaPernoite.cidade',
  'overnightStay.stateProvince': 'localEstadiaPernoite.estado',
  'coverages[].code': 'coberturas[].codigo',
  'coverages[].name': 'coberturas[].nome',
  'coverages[].description': 'coberturas[].descricao',
  'coverages[].deductible.code': 'coberturas[].franquia.codigo',
  'coverages[].deductible.description': 'coberturas[].franquia.descricao',
  'coverages[].deductible.data': 'coberturas[].franquia.dado',
  'coverages[].guarantees[].code': 'coberturas[].garantias[].codigo',
  'coverages[].guarantees[].name': 'coberturas[].garantias[].nome',
  'coverages[].guarantees[].description': 'coberturas[].garantias[].descricao',
  'coverages[].guarantees[].premiumValue': 'coberturas[].garantias[].valorPremio',
  'coverages[].guarantees[].deductibleValue': 'coberturas[].garantias[].valorDedutivel',
  'coverages[].guarantees[].data': 'coberturas[].garantias[].dado',
  'coverages[].additionals[].code': 'coberturas[].adicionais[].codigo',
  'coverages[].additionals[].name': 'coberturas[].adicionais[].nome',
  'coverages[].additionals[].description': 'coberturas[].adicionais[].descricao',
  'coverages[].additionals[].premiumValue': 'coberturas[].adicionais[].valorPremio',
  'coverages[].additionals[].deductibleValue': 'coberturas[].adicionais[].valorDedutivel',
  'coverages[].additionals[].data': 'coberturas[].adicionais[].dado',
  deductibleAmount: 'franquia',
  'questionnaire[].fieldCode': 'questionario[].codigo',
  'questionnaire[].fieldName': 'questionario[].nome',
  'questionnaire[].fieldDescription': 'questionario[].descricao',
  'questionnaire[].answer': 'questionario[].resposta'
};

const adiconarPrefixoAPP = ({ cobertura, codigosCoberturas }) => {
  for (let i = 0; i < codigosCoberturas.length; i++) {
    const garantia = cobertura.garantias.find((item) => item.codigo === codigosCoberturas[i]);
    if (garantia) garantia.nome = `APP ${garantia.nome}`;
  }
};

const mapearOpcoesDeCobertura = ({ cobertura, opcoesDeCobertura, codigosCoberturas }) => {
  const codigoValorDeMercadoReferenciado = '3';
  const valorDeMercadoReferenciado = opcoesDeCobertura.find((item) => item.code === codigoValorDeMercadoReferenciado);
  if (!valorDeMercadoReferenciado) return;

  for (let i = 0; i < codigosCoberturas.length; i++) {
    const opcaoDeCobertura = valorDeMercadoReferenciado.guarantees.find((item) => item.code === codigosCoberturas[i]);
    const garantia = cobertura.garantias.find((item) => item.codigo === codigosCoberturas[i]);

    const opcaoDaGarantia = opcaoDeCobertura.options.find((item) => item.code === garantia.dado);
    garantia.dado = opcaoDaGarantia.description;
  }
};

const mapeamentoAdicional = ({ oferta, opcoesDeCobertura }) => {
  oferta.coberturas.forEach((cobertura) => {
    const codigosParaAdicionarSufixoAPP = [
      CodigosCoberturasWizEnum.MORTE,
      CodigosCoberturasWizEnum.INVALIDEZ_PERMANENTE
    ];
    adiconarPrefixoAPP({ cobertura, codigosCoberturas: codigosParaAdicionarSufixoAPP });

    const codigosParaMapearOpcoesDeCobertura = [
      CodigosCoberturasWizEnum.DANOS_MATERIAIS,
      CodigosCoberturasWizEnum.DANOS_CORPORAIS
    ];
    mapearOpcoesDeCobertura({
      cobertura,
      opcoesDeCobertura,
      codigosCoberturas: codigosParaMapearOpcoesDeCobertura
    });

    cobertura.garantias.forEach((garantia) => {
      garantia.dado = formatarParaBRL(garantia.dado);
      garantia.nome = `${garantia.nome} - ${garantia.dado}`;
    });
  });

  return oferta;
};

exports.ofertasSerializer = (ofertaRequest) => objectMapper(ofertaRequest, {}, ofertasSerializerConfig);

exports.rejeicoesSerializer = (rejeicoes) => objectMapper(rejeicoes, {}, rejeicoesSerializerConfig);

exports.dadosAdicionaisSerializer = ({ oferta, opcoesDeCobertura }) => {
  const ofertaMapeada = objectMapper(oferta, {}, dadosSerializerConfig);
  return mapeamentoAdicional({ opcoesDeCobertura, oferta: ofertaMapeada });
};
