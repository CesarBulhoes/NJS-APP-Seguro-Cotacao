const { AtualizarCotacaoBS } = require('../../../../src/BS/Cotacao');
const { CotacaoDAO } = require('../../../../src/DAO');
const { AtualizarCotacaoSerializer } = require('../../../../src/Serializers/Cotacao');
const { StatusCotacaoWizEnum, StatusCotacaoEnum } = require('../../../../src/Utils/Enums');
const { InternalServerError } = require('../../../../src/Utils/Errors');
const { GetCurrentDate } = require('../../../../src/Utils/Helpers');
const { AutoApi } = require('../../../../src/Utils/Wiz');
const AutoApiDataFaker = require('../../../helpers/DataFakers/AutoApi');

const construirSut = () => ({ sut: AtualizarCotacaoBS });

describe('Considerando o AtualizarCotacaoBS', () => {
  describe('E a função atualizar é chamada', () => {
    test('E a função consultarDetalheCotacao de AutoApi lanca um erro', async () => {
      const autoApiConsultarDetalheCotacaoSpyComErro = jest
        .spyOn(AutoApi, 'consultarDetalheCotacao')
        .mockImplementation((data) => {
          autoApiConsultarDetalheCotacaoSpyComErro.mock.calls.push(data);
          throw new Error('qualquer erro');
        });

      const { sut } = construirSut();
      const fakeData = {
        NRC: 'qualquer_NRC',
        idCotacao: 'qualquer_idCotacao'
      };
      const resposta = await sut.atualizar(fakeData);

      expect(autoApiConsultarDetalheCotacaoSpyComErro).toHaveBeenCalled();
      expect(autoApiConsultarDetalheCotacaoSpyComErro.mock.calls[0][0]).toEqual(fakeData.idCotacao);
      expect(resposta.statusCode).toBe(500);
      expect(resposta.body).toEqual({ error: new InternalServerError().message });

      autoApiConsultarDetalheCotacaoSpyComErro.mockRestore();
    });
  });

  test('E o status da cotacao é PROCESSANDO', async () => {
    const autoApiConsultarDetalheCotacaoSpyCotacaoProcessando = jest
      .spyOn(AutoApi, 'consultarDetalheCotacao')
      .mockImplementation((data) => {
        autoApiConsultarDetalheCotacaoSpyCotacaoProcessando.mock.calls.push(data);
        return { status: { name: StatusCotacaoWizEnum.PROCESSANDO } };
      });

    const { sut } = construirSut();
    const fakeData = {
      NRC: 'qualquer_NRC',
      idCotacao: 'qualquer_idCotacao'
    };
    const resposta = await sut.atualizar(fakeData);

    expect(resposta.statusCode).toBe(400);
    expect(resposta.body).toEqual({ error: 'Cotação processando!' });

    autoApiConsultarDetalheCotacaoSpyCotacaoProcessando.mockRestore();
  });

  describe('E o status da cotacao é CONCLUIDO', () => {
    let dateSpy;
    let atualizarCotacaoDAOSpy;
    let autoApiConsultarDetalheCotacaoSpy;
    let autoApioConsultarOfertaSpy;
    let autoApioBuscarOpcoesDeCoberturaSpy;

    beforeAll(() => {
      const mockedDate = new Date(2000, 9, 1, 7);
      dateSpy = jest.spyOn(global, 'Date').mockImplementation(() => mockedDate);
    });

    beforeEach(() => {
      atualizarCotacaoDAOSpy = jest.spyOn(CotacaoDAO, 'atualizar').mockImplementation((data) => {
        atualizarCotacaoDAOSpy.mock.calls.push(data);
        return { data };
      });

      autoApiConsultarDetalheCotacaoSpy = jest.spyOn(AutoApi, 'consultarDetalheCotacao').mockImplementation((data) => {
        autoApiConsultarDetalheCotacaoSpy.mock.calls.push(data);
        return {
          status: { name: StatusCotacaoWizEnum.CONCLUIDO },
          offers: [{ id: 'qualquer_id' }]
        };
      });

      autoApioConsultarOfertaSpy = jest.spyOn(AutoApi, 'consultarOferta').mockImplementation((data) => {
        autoApioConsultarOfertaSpy.mock.calls.push(data);
        return AutoApiDataFaker.ConsultarOfertaDataFaker;
      });

      autoApioBuscarOpcoesDeCoberturaSpy = jest.spyOn(AutoApi, 'buscarOpcoesDeCobertura').mockImplementation((data) => {
        autoApioBuscarOpcoesDeCoberturaSpy.mock.calls.push(data);
        return AutoApiDataFaker.BuscarOpcoesDeCoberturaDataFaker;
      });
    });

    afterEach(() => {
      atualizarCotacaoDAOSpy.mockRestore();
      autoApiConsultarDetalheCotacaoSpy.mockRestore();
      autoApioConsultarOfertaSpy.mockRestore();
      autoApioBuscarOpcoesDeCoberturaSpy.mockRestore();
    });

    afterAll(() => dateSpy.mockRestore());

    test('E a cotação não tem ofertas e nem rejeições', async () => {
      const autoApiConsultarDetalheCotacaoSpyCotacaoSemOfertas = jest
        .spyOn(AutoApi, 'consultarDetalheCotacao')
        .mockImplementation((data) => {
          autoApiConsultarDetalheCotacaoSpyCotacaoSemOfertas.mock.calls.push(data);
          return { status: { name: StatusCotacaoWizEnum.CONCLUIDO }, offers: [] };
        });

      const { sut } = construirSut();
      const fakeData = {
        NRC: 'qualquer_NRC',
        idCotacao: 'qualquer_idCotacao'
      };
      const resposta = await sut.atualizar(fakeData);

      expect(atualizarCotacaoDAOSpy).toHaveBeenCalled();
      expect(atualizarCotacaoDAOSpy.mock.calls[0][0]).toEqual({
        ...fakeData,
        statusCotacao: StatusCotacaoEnum.CANCELADO,
        dataAtualizacao: GetCurrentDate.get()
      });
      expect(resposta.statusCode).toBe(200);
      expect(resposta.body).toEqual({ mensagem: 'Cotação atualizada.' });

      autoApiConsultarDetalheCotacaoSpyCotacaoSemOfertas.mockRestore();
    });

    test('E a cotação não tem ofertas mas tem rejeições', async () => {
      const autoApiConsultarDetalheCotacaoSpyCotacaoSemOfertas = jest
        .spyOn(AutoApi, 'consultarDetalheCotacao')
        .mockImplementation((data) => {
          autoApiConsultarDetalheCotacaoSpyCotacaoSemOfertas.mock.calls.push(data);
          return {
            status: { name: StatusCotacaoWizEnum.CONCLUIDO },
            offers: [],
            rejections: {
              createDate: GetCurrentDate.get(),
              providerName: 'qualquer_provider',
              reasons: 'qualquer_reason'
            }
          };
        });

      const { sut } = construirSut();
      const fakeData = {
        NRC: 'qualquer_NRC',
        idCotacao: 'qualquer_idCotacao'
      };
      const resposta = await sut.atualizar(fakeData);

      expect(atualizarCotacaoDAOSpy).toHaveBeenCalled();
      expect(atualizarCotacaoDAOSpy.mock.calls[0][0]).toEqual({
        ...fakeData,
        statusCotacao: StatusCotacaoEnum.CANCELADO,
        dataAtualizacao: GetCurrentDate.get(),
        rejeicoes: AtualizarCotacaoSerializer.rejeicoesSerializer(
          autoApiConsultarDetalheCotacaoSpyCotacaoSemOfertas.mock.results[0].value.rejections
        )
      });
      expect(resposta.statusCode).toBe(200);
      expect(resposta.body).toEqual({ mensagem: 'Cotação atualizada.' });

      autoApiConsultarDetalheCotacaoSpyCotacaoSemOfertas.mockRestore();
    });

    test('E a função consultarOferta de AutoApi lanca um erro', async () => {
      const autoApiConsultarOfertaSpyComErro = jest.spyOn(AutoApi, 'consultarOferta').mockImplementation((data) => {
        autoApiConsultarOfertaSpyComErro.mock.calls.push(data);
        throw new Error('qualquer erro');
      });

      const { sut } = construirSut();
      const fakeData = {
        NRC: 'qualquer_NRC',
        idCotacao: 'qualquer_idCotacao'
      };
      const resposta = await sut.atualizar(fakeData);

      expect(autoApiConsultarOfertaSpyComErro).toHaveBeenCalled();
      expect(autoApiConsultarOfertaSpyComErro.mock.calls[0][0]).toBe(
        autoApiConsultarDetalheCotacaoSpy.mock.results[0].value.offers[0].id
      );
      expect(resposta.statusCode).toBe(500);
      expect(resposta.body).toEqual({ error: new InternalServerError().message });

      autoApiConsultarOfertaSpyComErro.mockRestore();
    });

    test('E a função buscarOpcoesDeCobertura de AutoApi lanca um erro', async () => {
      const autoApiBuscarOpcoesDeCoberturaSpyComErro = jest
        .spyOn(AutoApi, 'buscarOpcoesDeCobertura')
        .mockImplementation((data) => {
          autoApiBuscarOpcoesDeCoberturaSpyComErro.mock.calls.push(data);
          throw new Error('qualquer erro');
        });

      const { sut } = construirSut();
      const fakeData = {
        NRC: 'qualquer_NRC',
        idCotacao: 'qualquer_idCotacao'
      };
      const resposta = await sut.atualizar(fakeData);

      expect(autoApiBuscarOpcoesDeCoberturaSpyComErro).toHaveBeenCalled();
      expect(autoApiBuscarOpcoesDeCoberturaSpyComErro.mock.calls[0][0]).toBe(
        autoApiConsultarDetalheCotacaoSpy.mock.results[0].value.offers[0].id
      );
      expect(resposta.statusCode).toBe(500);
      expect(resposta.body).toEqual({ error: new InternalServerError().message });

      autoApiBuscarOpcoesDeCoberturaSpyComErro.mockRestore();
    });

    test('E a cotação tem ofertas e a função atualizar é executada com sucesso', async () => {
      const { sut } = construirSut();
      const fakeData = {
        NRC: 'qualquer_NRC',
        idCotacao: 'qualquer_idCotacao'
      };
      const resposta = await sut.atualizar(fakeData);

      expect(atualizarCotacaoDAOSpy).toHaveBeenCalled();
      expect(atualizarCotacaoDAOSpy.mock.calls[0][0]).toEqual({
        ...fakeData,
        ofertas: AtualizarCotacaoSerializer.ofertasSerializer(autoApioConsultarOfertaSpy.mock.results[0].value),
        dadosAdicionais: AtualizarCotacaoSerializer.dadosAdicionaisSerializer({
          opcoesDeCobertura: autoApioBuscarOpcoesDeCoberturaSpy.mock.results[0].value,
          oferta: autoApioConsultarOfertaSpy.mock.results[0].value.data
        }),
        statusCotacao: StatusCotacaoEnum.CONCLUIDO,
        dataAtualizacao: GetCurrentDate.get()
      });
      expect(resposta.statusCode).toBe(200);
      expect(resposta.body).toEqual({ mensagem: 'Cotação atualizada.' });
    });
  });
});
