const { FiltrarCotacaoBS } = require('../../../../src/BS/Cotacao');
const { CotacaoDAO } = require('../../../../src/DAO');
const { serializeLista, serialize } = require('../../../../src/Serializers/Cotacao/ConsultarCotacaoSerializer');
const { InvalidRequestError, InternalServerError } = require('../../../../src/Utils/Errors');
const { RequestValidator } = require('../../../../src/Utils/Helpers');

// const construirSut = () => ({ sut: ConsultarCotacaoBS });

describe('Considerando o FiltrarCotacaoBS', () => {
  describe('E a função filtrar é chamada', () => {
    it('E um objeto com o atributo "query" é passado com os filtros', async () => {
      const helper = await FiltrarCotacaoBS.filtrar({
        query: {
          cpf: '111111111111',
          statusCotacao: 'processando',
          nome: 'Augusto',
          cepPernoite: '33333-772',
          modelo: 'bot',
          placa: 'bot',
          provedores: ['TESTE SEGUROS S.A', 'HDI SEGUROS S.A', 'NOT SEGUROS S.A'],
          dataInicio: new Date('2022-04-20'),
          dataFim: new Date('2022-04-30'),
          pagina: null,
          limite: 10
        }
      });

      expect(helper).toStrictEqual({
        body: {
          itens: [
            {
              cepPernoite: '33333-772',
              cpf: '111111111111',
              dadosAdicionais: undefined,
              dataAtualizacao: '2022-04-28T18:49:20.785Z',
              dataCriacao: '2022-04-28T18:49:20.785Z',
              email: 'cesar@valido.com',
              idCotacao: 'f1bbed24-d4c2-4c44-9f00-523afce7b681',
              nome: 'Augusto',
              ofertas: undefined,
              provedores: ['HDI SEGUROS S.A', 'HDI SEGUROS S.A'],
              rejeicoes: undefined,
              statusCotacao: 'processando',
              veiculo: {
                modelo: 'BOT S 1.0 16V FLEX FUEL 5P',
                placa: 'BOT4521'
              }
            }
          ],
          listados: 1,
          proximaPagina: undefined,
          total: 1
        },
        statusCode: 200
      });
    });

    it('E um objeto vazio é passado', async () => {
      const helper = await FiltrarCotacaoBS.filtrar({});

      expect(helper.statusCode).toBe(200);
    });

    it('E uma string é passada', async () => {
      const helper = await FiltrarCotacaoBS.filtrar('{}');

      expect(helper).toStrictEqual({
        body: {
          error: 'InvalidRequestError: ValidationError: "value" must be of type object'
        },
        statusCode: 400
      });
    });
  });
});
