const serialize = ({
  idCotacao,
  nome,
  cpf,
  email,
  cepPernoite,
  provedores,
  veiculo,
  statusCotacao,
  dataCriacao,
  dataAtualizacao
}) => ({
  idCotacao,
  nome,
  cpf,
  email,
  cepPernoite,
  provedores,
  veiculo,
  statusCotacao,
  dataCriacao,
  dataAtualizacao
});

module.exports = {
  serialize
};
