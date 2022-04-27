const mapearProvedores = (provedor) => (provedor === 'HDI SEGUROS S.A' ? 'HDI.OneClick' : provedor);
const mapearEndereco = ({ nomeEndereco, cidade, complemento, bairro, numero, estado, uf, cep }) => ({
  AddressName: nomeEndereco,
  City: cidade,
  Complement: complemento,
  Neighborhood: bairro,
  Number: numero,
  StateProvince: estado,
  StateProvinceAbbreviation: uf,
  Zipcode: cep
});

exports.solicitarCotacaoAdapter = ({ provedores, veiculo: { placa, modelo }, cpf, cepPernoite }) => ({
  providers: provedores.map((provedor) => mapearProvedores(provedor)),
  plate: placa,
  vehicleModelDescription: modelo,
  insuredCpf: cpf,
  zipcodeOvernightStay: cepPernoite
});

exports.efetivarOferta = ({
  idOferta,
  codigoMetodoPagamento,
  totalParcelas,
  codigoChassi,
  nome,
  email,
  rendaMensalMedia,
  ocupacao,
  codigoOcupacao,
  sexo,
  telefone,
  dataNascimento,
  estadoCivil,
  endereco,
  documents
}) => ({
  offerId: idOferta,
  PaymentMethodCode: codigoMetodoPagamento,
  TotalOfInstallments: totalParcelas,
  Data: {
    ChassisCode: codigoChassi
  },
  Payer: {
    Name: nome,
    Email: email,
    income: rendaMensalMedia,
    Occupation: ocupacao,
    OccupationCode: codigoOcupacao,
    Entity: sexo,
    Phone1: telefone,
    DateOfBirthday: dataNascimento,
    MaritalStatus: estadoCivil,
    Address: endereco && mapearEndereco(endereco),
    Documents: documents || []
  }
});
