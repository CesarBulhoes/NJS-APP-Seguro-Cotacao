exports.isEmpty = (obj) => {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
};

exports.pegarChavesNaoVazias = (obj) => {
  let atributosValidos = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key]) atributosValidos[key] = obj[key];
  });

  return atributosValidos;
};
