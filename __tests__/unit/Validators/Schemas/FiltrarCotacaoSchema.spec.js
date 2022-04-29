const { FiltrarCotacaoSchema } = require('../../../../src/Validators/Schemas');
const { RequestValidator } = require('../../../../src/Utils/Helpers');

const validarRequisicao = (data) => new RequestValidator({ schema: FiltrarCotacaoSchema }).validate(data);

describe('Considerando o FiltrarCotacaoSchema', () => {
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
      cpf: '111111111111',
      statusCotacao: 'processando',
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
      cpf: '111111111111',
      statusCotacao: 'processando',
      nome: 'Augusto',
      cepPernoite: '33333-772',
      modelo: 'bot',
      placa: 'bot',
      provedores: ['TESTE SEGUROS S.A', 'HDI SEGUROS S.A', 'NOT SEGUROS S.A'],
      dataInicio: new Date('2022-04-20'),
      dataFim: new Date('2022-04-30'),
      pagina: '{"cpf":"111111111111","NRC":"qualquer_NRC","idCotacao":"91420f88-1e4a-42ab-8969-387be04d8a8f"}',
      limite: 10
    });
  });

  it('Passando uma pagina com uma string que não é um objeto stringificado', () => {
    const requisicao = {
      cpf: '111111111111',
      statusCotacao: 'processando',
      nome: 'Augusto',
      cepPernoite: '33333-772',
      modelo: 'bot',
      placa: 'bot',
      provedores: ['TESTE SEGUROS S.A', 'HDI SEGUROS S.A', 'NOT SEGUROS S.A'],
      dataInicio: new Date('2022-04-20'),
      dataFim: new Date('2022-04-30'),
      pagina: '"cpf":"1111111:"91420f88-1e4a-42ab-8969-387be04d8a8f"}',
      limite: 10
    };
    const { value, erro } = validarRequisicao(requisicao);

    expect(erro.message).toBe('"pagina" contains an invalid value');
  });
});
