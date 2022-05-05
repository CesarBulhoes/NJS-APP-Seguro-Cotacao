const ConsultarPdfPropostaBS = require('../../../../src/BS/Proposta/ConsultarPdfPropostaBS');

describe('Considerando o ConsultarPdfPropostaBS', () => {
  describe('E a função consultar é chamada', () => {
    it('E passamos um NRC e um idProposta válidos', async () => {
      const helper = await ConsultarPdfPropostaBS.consultar({
        NRC: 'qualquer_NRC',
        idProposta: 'edef1812-726c-42e5-bd07-2dac3301b5ff'
      });

      expect({ statusCode: helper.statusCode }).toStrictEqual({
        statusCode: 200
      });
    });

    fit('E passamos um idProposta inválido', async () => {
      const helper = await ConsultarPdfPropostaBS.consultar({
        NRC: 'qualquer_NRC',
        idProposta: 'edef1812-726c-42e5-bd07-2dac3301b5fff'
      });

      expect({ statusCode: helper.statusCode }).toStrictEqual({
        statusCode: 500
      });
    });
  });
});
