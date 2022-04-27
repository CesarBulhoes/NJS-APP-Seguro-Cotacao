const { ConsultarCotacaoSerializer } = require('../../../src/Serializers/Cotacao');
const { CodigosCoberturasWizEnum } = require('../../../src/Utils/Enums');

const construirSut = () => ({ sut: ConsultarCotacaoSerializer });

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

describe('Considerando o ConsultarCotacaoSerializer', () => {
  describe('E o parametro coberturas de dadosAdicionais é fornecido conforme o esperado', () => {
    test('Então espero que isso ordene a lista de garantias', async () => {
      const { sut } = construirSut();
      const payloadFake = {
        dadosAdicionais: {
          franquia: 'qualquer_franquia',
          coberturas: [
            {
              descricao: 'qualquer_descricao',
              franquia: { descricao: 'qualquer_descricao' },
              garantias: [
                {
                  codigo: CodigosCoberturasWizEnum.CASCO
                },
                {
                  codigo: CodigosCoberturasWizEnum.MORTE
                },
                {
                  codigo: CodigosCoberturasWizEnum.INVALIDEZ_PERMANENTE
                },
                {
                  codigo: CodigosCoberturasWizEnum.DANOS_MATERIAIS
                },
                {
                  codigo: CodigosCoberturasWizEnum.DANOS_CORPORAIS
                }
              ],
              adicionais: [
                {
                  codigo: CodigosCoberturasWizEnum.CARRO_RESERVA
                },
                {
                  codigo: CodigosCoberturasWizEnum.HDI_AUTO_VIDROS
                },
                {
                  codigo: CodigosCoberturasWizEnum.DANOS_MORAIS
                },
                {
                  codigo: CodigosCoberturasWizEnum.GUINCHO_SEM_LIMITE
                }
              ]
            }
          ]
        }
      };

      const resposta = sut.serialize(JSON.parse(JSON.stringify(payloadFake)));
      resposta.dadosAdicionais.coberturas[0].garantias.shift();

      ordenarCoberturas(payloadFake.dadosAdicionais);
      expect(resposta.dadosAdicionais.coberturas).toEqual(payloadFake.dadosAdicionais.coberturas);
    });
  });
});
