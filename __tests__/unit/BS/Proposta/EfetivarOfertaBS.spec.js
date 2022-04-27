const EfetivarOfertaBS = require('../../../../src/BS/Proposta/EfetivarOfertaBS');
const { PropostaDAO, CotacaoDAO } = require('../../../../src/DAO');
const { AutoApi } = require('../../../../src/Utils/Wiz');

describe('Considerando o EfetivarOfertaBS', () => {
  describe('E a função execute é chamada', () => {
    beforeEach(() => {
      jest.spyOn(AutoApi, 'efetivarOferta').mockImplementation().mockRestore();
      jest.spyOn(PropostaDAO, 'registrar').mockImplementation().mockRestore();
      jest.spyOn(CotacaoDAO, 'consultar').mockImplementation().mockRestore();
      jest.spyOn(CotacaoDAO, 'atualizar').mockImplementation().mockRestore();
    });

    test('Teste sucesso', async () => {
      const body = {
        NRC: '123',
        cpf: '59061257794',
        idCotacao: 'c87e678f-945c-44d2-9fdb-3fc0cd84bd79',
        idOferta: '6dfd9efe-583c-458d-b295-1eda0366d211'
      };

      jest.spyOn(AutoApi, 'efetivarOferta').mockImplementation(() => ({
        id: 'any',
        number: 'any',
        status: {
          id: 1,
          name: 'transmitted',
          description: 'Transmitida'
        }
      }));
      jest.spyOn(PropostaDAO, 'registrar').mockImplementation((data) => Promise.resolve(data));
      jest.spyOn(CotacaoDAO, 'consultar').mockImplementation((data) =>
        Promise.resolve({
          ...data,
          dadosAdicionais: {
            valorLiquidoPremio: 'teste',
            iof: 'teste',
            valorPremio: 'teste',
            veiculo: {},
            coberturas: [
              {
                adicionais: [{ codigo: '265' }, { codigo: '266' }],
                garantias: [{ codigo: '55' }, { codigo: '56' }]
              }
            ]
          },
          ofertas: {
            nomeProvedor: 'teste'
          }
        })
      );
      jest.spyOn(CotacaoDAO, 'atualizar').mockImplementation((data) => Promise.resolve(data));

      const result = await EfetivarOfertaBS.execute(body);
      expect(result).toHaveProperty('statusCode', 200);
      expect(result).toHaveProperty('body');
    });

    test('Teste requisição inválida', async () => {
      const result = await EfetivarOfertaBS.execute({});
      expect(result).toHaveProperty('statusCode', 400);
      expect(result).toHaveProperty('body');
      expect(result.body).toHaveProperty(
        'error',
        'InvalidRequestError: ValidationError: "NRC" is required. "idCotacao" is required. "idOferta" is required. "cpf" is required'
      );
    });

    test('Teste erro', async () => {
      jest.spyOn(AutoApi, 'efetivarOferta').mockImplementation(() => Promise.reject(new Error('Erro de integração')));

      const body = {
        NRC: '123',
        cpf: '59061257794',
        idCotacao: 'c87e678f-945c-44d2-9fdb-3fc0cd84bd79',
        idOferta: '6dfd9efe-583c-458d-b295-1eda0366d211'
      };
      try {
        await EfetivarOfertaBS.execute(body);
      } catch (erro) {
        expect(erro).toHaveProperty('message', 'Erro de integração');
      }
    });
  });
});
