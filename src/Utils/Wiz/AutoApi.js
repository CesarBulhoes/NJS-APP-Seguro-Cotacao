const consoleStp = require('libStpInvoke').Console;

const errorClient = require('../ErrorClient');
const { MissingParamError } = require('../Errors');
const { WizAutoHttp } = require('./WizHttp');

const URL_BUSCAR_OPCOES_COBERTURA = 'api/v1.0/offer/:offerId/coverages-options';
const URL_SUBMETER_COTACAO = 'api/v1.0/quotation';
const URL_BUSCAR_VEICULO = 'api/v1.0/common/vehicles/search';
const URL_CUNSULTAR_OFERTA = 'api/v1.0/offer';
const URL_EFETIVAR_OFERTA = 'api/v1.0/proposal';
const URL_PDF_Proposta = 'api/v1.0/proposal/[idProposta]/pdf';

exports.buscarOpcoesDeCobertura = async (idOferta) => {
  if (!idOferta) throw new MissingParamError('idOferta');

  try {
    const result = await WizAutoHttp.get(URL_BUSCAR_OPCOES_COBERTURA.replace(':offerId', idOferta));
    return result.data;
  } catch (erro) {
    consoleStp.error(`Erro API externa: ${JSON.stringify(erro)}`);
    throw new Error('Erro de integração com o parceiro');
  }
};

exports.solicitarCotacao = async (payload) => {
  if (!payload) throw new MissingParamError('payload');

  try {
    const result = await WizAutoHttp.put(URL_SUBMETER_COTACAO, payload);
    return result.data;
  } catch (erro) {
    consoleStp.error(`Erro API externa: ${JSON.stringify(erro)}`);
    throw new Error('Erro de integração com o parceiro');
  }
};

exports.consultarDetalheCotacao = async (idCotacao) => {
  if (!idCotacao) throw new MissingParamError('idCotacao');

  try {
    const result = await WizAutoHttp.get(`${URL_SUBMETER_COTACAO}/${idCotacao}`);
    return result.data;
  } catch (erro) {
    consoleStp.error(`Erro API externa: ${JSON.stringify(erro)}`);
    throw new Error('Erro de integração com o parceiro');
  }
};

exports.buscarVeiculo = async (placa) => {
  if (!placa) throw new MissingParamError('placa');

  try {
    const result = await WizAutoHttp.get(`${URL_BUSCAR_VEICULO}/${placa}`);
    return result.data;
  } catch (erro) {
    consoleStp.error(`Erro API externa: ${JSON.stringify(erro)}`);
    throw new Error('Erro de integração com o parceiro');
  }
};

exports.consultarOferta = async (idOferta) => {
  if (!idOferta) throw new MissingParamError('idOferta');

  try {
    const result = await WizAutoHttp.get(`${URL_CUNSULTAR_OFERTA}/${idOferta}`);
    return result.data;
  } catch (erro) {
    consoleStp.error(`Erro API externa: ${JSON.stringify(erro)}`);
    throw new Error('Erro de integração com o parceiro');
  }
};

exports.efetivarOferta = async ({ offerId, ...payload }) => {
  if (!offerId) throw new MissingParamError('offerId');

  try {
    const result = await WizAutoHttp.put(`${URL_EFETIVAR_OFERTA}/${offerId}`, payload);
    return result.data;
  } catch (erro) {
    consoleStp.error(`Erro API externa: ${errorClient(erro)}`);
    throw new Error('Erro de integração com o parceiro');
  }
};

exports.consultarPdfProposta = async ({ idProposta }) => {
  if (!idProposta) throw new MissingParamError('idProposta');

  try {
    const result = await WizAutoHttp.get(URL_PDF_Proposta.replace('[idProposta]', idProposta));
    return result.data;
  } catch (erro) {
    consoleStp.error(`Erro API externa: ${errorClient(erro)}`);
    throw new Error('Erro de integração com o parceiro');
  }
};
