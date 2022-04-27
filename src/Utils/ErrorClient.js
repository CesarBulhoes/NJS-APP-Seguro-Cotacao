const buildError = (error) => {
  const { request, code, errno, message, isAxiosError, stack } = error;
  request.internalError = { code, errno, message, isAxiosError, stack };
  request.status = 'Service Unavailable';

  return request;
};

const ErrorClient = (error) => {
  if (error.response) {
    // A solicitação foi feita e o servidor respondeu com um código de status
    // que está fora do intervalo de 2xx
    return error.response;
  }
  if (error.request) {
    // A solicitação foi feita, mas nenhuma resposta foi recebida
    // `error.request` é uma instância de XMLHttpRequest no navegador e uma instância de
    // http.ClientRequest em node.js
    return buildError(error);
  }
  // Algo aconteceu na configuração da solicitação que acionou um erro
  error.status = 'Internal Server Error';
  return error;
};

module.exports = ErrorClient;
