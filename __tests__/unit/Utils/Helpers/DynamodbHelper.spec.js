const { MissingParamError } = require('../../../../src/Utils/Errors');
const { DynamodbHelper } = require('../../../../src/Utils/Helpers');

describe('Utils :: Helpers :: DynamodbHelper', () => {
  describe('metodo makeDynamicUpdateParams', () => {
    test('quando não é passado os campos obrigatórios', () => {
      const helper = DynamodbHelper.makeDynamicUpdateParams({ test: 'test' });
      expect(helper).toHaveProperty('ExpressionAttributeValues');
      expect(helper).toHaveProperty('ExpressionAttributeNames');
      expect(helper).toHaveProperty('UpdateExpression');
    });

    test('quando não é passado os dados de entrada', () => {
      expect(() => DynamodbHelper.makeDynamicUpdateParams(null)).toThrowError(new MissingParamError('payload'));
    });

    test('quando um objeto vazio é fornecido', () => {
      const resposta = DynamodbHelper.makeDynamicUpdateParams({});
      expect(resposta).toBeNull();
    });
  });

  describe('metodo makeDynamicScanParams', () => {
    test('quando não é passado os campos obrigatórios', () => {
      const helper = DynamodbHelper.makeDynamicScanParams({ test: 'test' });
      expect(helper).toHaveProperty('ExpressionAttributeValues');
      expect(helper).toHaveProperty('ExpressionAttributeNames');
      expect(helper).toHaveProperty('FilterExpression');
    });

    test('quando não é passado os dados de entrada', () => {
      expect(() => DynamodbHelper.makeDynamicScanParams(null)).toThrowError(new MissingParamError('payload'));
    });

    test('quando um objeto vazio é fornecido', () => {
      const resposta = DynamodbHelper.makeDynamicScanParams({});
      expect(resposta).toBeNull();
    });
  });

  describe('metodo makeDynamicQueryGlobalSecondaryParams', () => {
    let filtros;

    beforeEach(() => {
      filtros = {
        query: [],
        equal: [],
        contains: [],
        contains_nested: [],
        contains_array: [],
        between: [],
        page: [],
        limit: [],
        table: []
      };
    });

    describe('Gerando parametros de busca com filtro ', () => {
      it('Passando apenas a TableName', () => {
        filtros['table'].push({ NOME_DA_TABELA: 'NOME_DA_TABELA' });

        const helper = DynamodbHelper.makeDynamicQueryGlobalSecondaryParams(filtros);

        expect(helper).toStrictEqual({
          TableName: 'NOME_DA_TABELA'
        });
      });

      it('Passando apenas a Page', () => {
        filtros['page'] = [JSON.stringify({ pagina: 'pagina' })];

        const helper = DynamodbHelper.makeDynamicQueryGlobalSecondaryParams(filtros);

        expect(helper).toStrictEqual({
          ExclusiveStartKey: { pagina: 'pagina' }
        });
      });

      it('Passando apenas o Limit', () => {
        filtros['limit'] = [{ limite: 10 }];

        const helper = DynamodbHelper.makeDynamicQueryGlobalSecondaryParams(filtros);

        expect(helper).toStrictEqual({
          Limit: 10
        });
      });

      it('Passando um IndexName', () => {
        filtros['query'].push({ identificador: 123 });

        const helper = DynamodbHelper.makeDynamicQueryGlobalSecondaryParams(filtros);

        expect(helper).toStrictEqual({
          ExpressionAttributeValues: { ':identificador': 123 },
          ExpressionAttributeNames: { '#identificador': 'identificador' },
          IndexName: 'identificador-index',
          KeyConditionExpression: '#identificador = :identificador'
        });
      });

      it('Passando um campo com o opedaror Igual', () => {
        filtros['equal'].push({ identificador: 123 });

        const helper = DynamodbHelper.makeDynamicQueryGlobalSecondaryParams(filtros);

        expect(helper).toStrictEqual({
          ExpressionAttributeNames: {
            '#identificador': 'identificador'
          },
          ExpressionAttributeValues: {
            ':identificador': 123
          },
          FilterExpression: ' #identificador = :identificador'
        });
      });

      it('Passando um campo com o opedaror Contém', () => {
        filtros['contains'].push({ identificador: 123 });

        const helper = DynamodbHelper.makeDynamicQueryGlobalSecondaryParams(filtros);

        expect(helper).toStrictEqual({
          ExpressionAttributeNames: {
            '#identificador': 'identificador'
          },
          ExpressionAttributeValues: {
            ':identificador': 123
          },
          FilterExpression: ' contains(#identificador, :identificador)'
        });
      });

      it('Passando um campo com o opedaror Contém checando um atributo em um objeto aninhado', () => {
        filtros['contains_nested'].push({ path: ['usuario', 'identificador'], value: 123 });

        const helper = DynamodbHelper.makeDynamicQueryGlobalSecondaryParams(filtros);

        expect(helper).toStrictEqual({
          ExpressionAttributeNames: {
            '#identificador': 'identificador',
            '#usuario': 'usuario',
            '#value': 'value'
          },
          ExpressionAttributeValues: {
            ':value': 123
          },
          FilterExpression: ' contains(#usuario.#identificador, :value)'
        });
      });

      it('Passando um campo com o opedaror Contém checando um atributo em um objeto aninhado - substituindo o nome da variavel value pelo nome do atributo real', () => {
        filtros['contains_nested'].push({ path: ['usuario', 'identificador'], identificador: 123 });

        const helper = DynamodbHelper.makeDynamicQueryGlobalSecondaryParams(filtros);

        expect(helper).toStrictEqual({
          ExpressionAttributeNames: {
            '#identificador': 'identificador',
            '#usuario': 'usuario'
          },
          ExpressionAttributeValues: {
            ':identificador': 123
          },
          FilterExpression: ' contains(#usuario.#identificador, :identificador)'
        });
      });

      it('Passando um campo com o opedaror Contém em Array', () => {
        filtros['contains_array'].push({ identificadores: [123, 213, 321, 231] });

        const date = new Date('2022-04-28T10:15:00.000Z');

        const helper = DynamodbHelper.makeDynamicQueryGlobalSecondaryParams(filtros);

        expect(helper).toStrictEqual({
          ExpressionAttributeNames: {
            '#identificadores': 'identificadores'
          },
          ExpressionAttributeValues: {
            ':identificadores0': 123,
            ':identificadores1': 213,
            ':identificadores2': 321,
            ':identificadores3': 231
          },
          FilterExpression:
            ' (contains(#identificadores, :identificadores0) or contains(#identificadores, :identificadores1) or contains(#identificadores, :identificadores2) or contains(#identificadores, :identificadores3))'
        });
      });

      it('Passando um campo com o opedaror Between', () => {
        filtros['between'].push({
          dataInicio: new Date('2021-03-01').toISOString().split('T')[0] + 'T00:00:00.000Z',
          dataFim: new Date('2021-04-29').toISOString().split('T')[0] + 'T23:59:99.999Z',
          column: 'dataCriacao'
        });

        const helper = DynamodbHelper.makeDynamicQueryGlobalSecondaryParams(filtros);

        expect(helper).toStrictEqual({
          ExpressionAttributeNames: {
            '#dataCriacao': 'dataCriacao'
          },
          ExpressionAttributeValues: {
            ':dataFim': '2021-04-29T23:59:99.999Z',
            ':dataInicio': '2021-03-01T00:00:00.000Z'
          },
          FilterExpression: ' #dataCriacao BETWEEN :dataInicio and :dataFim'
        });
      });

      it('Passando todos os filtros possíveis', () => {
        filtros['table'].push({ NOME_DA_TABELA: 'NOME_DA_TABELA' });
        filtros['page'] = [JSON.stringify({ pagina: 'pagina' })];
        filtros['limit'] = [{ limite: 10 }];
        filtros['query'].push({ identificador: 123 });
        filtros['equal'].push({ identificador: 123 });
        filtros['contains'].push({ identificador: 123 });
        filtros['contains_nested'].push({ path: ['usuario', 'identificador'], value: 123 });
        filtros['contains_array'].push({ identificadores: [123, 213, 321, 231] });
        filtros['between'].push({
          dataInicio: new Date('2021-03-01').toISOString().split('T')[0] + 'T00:00:00.000Z',
          dataFim: new Date('2021-04-29').toISOString().split('T')[0] + 'T23:59:99.999Z',
          column: 'dataCriacao'
        });

        const helper = DynamodbHelper.makeDynamicQueryGlobalSecondaryParams(filtros);

        expect(helper).toStrictEqual({
          TableName: 'NOME_DA_TABELA',
          ExclusiveStartKey: {
            pagina: 'pagina'
          },
          ExpressionAttributeNames: {
            '#dataCriacao': 'dataCriacao',
            '#identificador': 'identificador',
            '#identificadores': 'identificadores',
            '#usuario': 'usuario',
            '#value': 'value'
          },
          ExpressionAttributeValues: {
            ':dataFim': '2021-04-29T23:59:99.999Z',
            ':dataInicio': '2021-03-01T00:00:00.000Z',
            ':identificador': 123,
            ':identificadores0': 123,
            ':identificadores1': 213,
            ':identificadores2': 321,
            ':identificadores3': 231,
            ':value': 123
          },
          FilterExpression:
            ' #identificador = :identificador and contains(#identificador, :identificador) and contains(#usuario.#identificador, :value) and (contains(#identificadores, :identificadores0) or contains(#identificadores, :identificadores1) or contains(#identificadores, :identificadores2) or contains(#identificadores, :identificadores3)) and #dataCriacao BETWEEN :dataInicio and :dataFim',
          IndexName: 'identificador-index',
          KeyConditionExpression: '#identificador = :identificador',
          Limit: 10
        });
      });

      it('Passando um objeto vazio', () => {
        filtros = {};

        expect(async () => {
          DynamodbHelper.makeDynamicQueryGlobalSecondaryParams(filtros);
        }).rejects.toThrow(new Error('Missing Param: payload'));
      });
    });
  });

  describe('metodo getTotalQueryParams', () => {
    let filtros;

    beforeEach(() => {
      filtros = {
        query: [],
        equal: [],
        contains: [],
        contains_nested: [],
        contains_array: [],
        between: [],
        page: [],
        limit: [],
        table: []
      };
    });

    it('Passando filtros para a função', () => {
      filtros['table'].push({ NOME_DA_TABELA: 'NOME_DA_TABELA' });
      filtros['page'] = [JSON.stringify({ pagina: 'pagina' })];
      filtros['limit'] = [{ limite: 10 }];
      filtros['query'].push({ identificador: 123 });
      filtros['equal'].push({ identificador: 123 });
      filtros['contains'].push({ identificador: 123 });
      filtros['contains_nested'].push({ path: ['usuario', 'identificador'], value: 123 });
      filtros['contains_array'].push({ identificadores: [123, 213, 321, 231] });
      filtros['between'].push({
        dataInicio: new Date('2021-03-01').toISOString().split('T')[0] + 'T00:00:00.000Z',
        dataFim: new Date('2021-04-29').toISOString().split('T')[0] + 'T23:59:99.999Z',
        column: 'dataCriacao'
      });

      const helper = DynamodbHelper.getTotalQueryParams(DynamodbHelper.makeDynamicQueryGlobalSecondaryParams(filtros));

      expect(helper).toStrictEqual({
        TableName: 'NOME_DA_TABELA',
        ExpressionAttributeNames: {
          '#dataCriacao': 'dataCriacao',
          '#identificador': 'identificador',
          '#identificadores': 'identificadores',
          '#usuario': 'usuario',
          '#value': 'value'
        },
        ExpressionAttributeValues: {
          ':dataFim': '2021-04-29T23:59:99.999Z',
          ':dataInicio': '2021-03-01T00:00:00.000Z',
          ':identificador': 123,
          ':identificadores0': 123,
          ':identificadores1': 213,
          ':identificadores2': 321,
          ':identificadores3': 231,
          ':value': 123
        },
        FilterExpression:
          ' #identificador = :identificador and contains(#identificador, :identificador) and contains(#usuario.#identificador, :value) and (contains(#identificadores, :identificadores0) or contains(#identificadores, :identificadores1) or contains(#identificadores, :identificadores2) or contains(#identificadores, :identificadores3)) and #dataCriacao BETWEEN :dataInicio and :dataFim',
        IndexName: 'identificador-index',
        KeyConditionExpression: '#identificador = :identificador',
        Select: 'COUNT'
      });
    });

    it('Passando filtros vazios para a função', () => {
      filtros = {};

      expect(async () => {
        DynamodbHelper.getTotalQueryParams(DynamodbHelper.makeDynamicQueryGlobalSecondaryParams(filtros));
      }).rejects.toThrow(new Error('Missing Param: payload'));
    });
  });
});
