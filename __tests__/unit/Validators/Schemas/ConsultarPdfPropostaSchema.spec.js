const { ConsultarPdfPropostaSchema } = require('../../../../src/Validators/Schemas');
const { RequestValidator } = require('../../../../src/Utils/Helpers');

const validarRequisicao = (data) => new RequestValidator({ schema: ConsultarPdfPropostaSchema }).validate(data);

describe('Considerando o ConsultarPdfPropostaSchema', () => {
  describe('E os filtros são fornecidos', () => {
    test('Passando valores que não pertencem ao schema', () => {
      const requisicao = {
        b: 'asd',
        test: 'test',
        value: 123
      };
      const { value, erro } = validarRequisicao(requisicao);
      expect(value).toStrictEqual({});
    });
  });

  it('Passando valores que pertencem e que não pertencem ao schema', () => {
    const requisicao = {
      NRC: '111111111111',
      idProposta: 'asdasd-asdas-da-sddsasd-asd',
      nome: 'Augusto',
      cepPernoite: '33333-772',
      modelo: 'bot',
      placa: 'bot',
      provedores: ['TESTE SEGUROS S.A', 'HDI SEGUROS S.A', 'NOT SEGUROS S.A'],
      dataInicio: new Date('2022-04-20'),
      dataFim: new Date('2022-04-30'),
      pagina: '{"cpf":"111111111111","NRC":"qualquer_NRC","idCotacao":"91420f88-1e4a-42ab-8969-387be04d8a8f"}',
      limite: 10,
      b: 'asd',
      test: 'test',
      value: 123
    };

    const { value, erro } = validarRequisicao(requisicao);
    expect(value).toStrictEqual({
      NRC: '111111111111',
      idProposta: 'asdasd-asdas-da-sddsasd-asd'
    });
  });
});
