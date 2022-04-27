exports.obter = (lista) => {
  const compararObjetos = (objeto1, objeto2) => JSON.stringify(objeto1) === JSON.stringify(objeto2);
  const filtrarItemsRepetidos = (itemComparacao, index) =>
    index === lista.findIndex((item) => compararObjetos(item, itemComparacao));

  const listaSemDuplicatas = lista.filter((value, index) => filtrarItemsRepetidos(value, index));
  return listaSemDuplicatas;
};
