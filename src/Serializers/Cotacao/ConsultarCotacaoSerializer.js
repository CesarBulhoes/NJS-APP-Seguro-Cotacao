const { CodigosCoberturasWizEnum } = require('../../Utils/Enums');
const {
  FormatadorDeMoedas: { formatarParaBRL }
} = require('../../Utils/Helpers');

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

const ordenarCoberturas = ({ coberturas } = {}) => {
  if (!coberturas) return;

  const regraDeOrdenacao = (cobertura, coberturaComparacao) =>
    ordemCoberturas[cobertura.codigo] - ordemCoberturas[coberturaComparacao.codigo];

  coberturas.forEach((cobertura) => {
    cobertura.garantias.sort(regraDeOrdenacao);
    cobertura.adicionais.sort(regraDeOrdenacao);
  });
};

const adicionarVeiculo = ({ dadosAdicionais }) => {
  if (!dadosAdicionais) return;

  dadosAdicionais.coberturas.forEach((cobertura) => {
    const garantiaCasco = cobertura.garantias.find((item) => item.codigo === CodigosCoberturasWizEnum.CASCO);
    if (!garantiaCasco) return;

    const garantiaVeiculo = {
      nome: 'Veículo',
      codigo: 'veiculo',
      descricao: `Cobertura: ${cobertura.descricao} \nFipe: ${
        dadosAdicionais.fipePercentualusado
      }% do total\nFranquia: ${cobertura.franquia.descricao}\nValor: ${formatarParaBRL(dadosAdicionais.franquia)}`
    };
    cobertura.garantias.unshift({ ...garantiaCasco, ...garantiaVeiculo });
  });
};

const serialize = ({
  idCotacao,
  nome,
  cpf,
  email,
  cepPernoite,
  veiculo,
  provedores,
  statusCotacao,
  ofertas,
  dadosAdicionais,
  rejeicoes,
  dataCriacao,
  dataAtualizacao
}) => {
  adicionarVeiculo({ dadosAdicionais });
  ordenarCoberturas(dadosAdicionais);

  return {
    idCotacao,
    nome,
    cpf,
    email,
    cepPernoite,
    veiculo,
    provedores,
    statusCotacao,
    ofertas,
    dadosAdicionais,
    rejeicoes,
    dataCriacao,
    dataAtualizacao
  };
};

const serializeLista = (cotacoes) => cotacoes.map((cotacao) => serialize(cotacao));

module.exports = {
  serialize,
  serializeLista
};
