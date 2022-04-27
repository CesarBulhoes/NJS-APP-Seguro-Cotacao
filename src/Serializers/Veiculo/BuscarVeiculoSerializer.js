const serialize = ({ branch, model, color, description, category, fuel, manufactureYear, modelYear, plate, age }) => ({
  marca: branch,
  modelo: model,
  cor: color,
  descricao: description,
  categoria: category,
  combustivel: fuel,
  anoFabricacao: manufactureYear,
  anoModelo: modelYear,
  placa: plate,
  idade: age
});

const serializeLista = (data) => data.map((value) => serialize(value));

module.exports = {
  serialize,
  serializeLista
};
