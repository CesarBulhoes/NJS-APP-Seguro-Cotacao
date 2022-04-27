exports.validar = (data) => {
  const cpf = data.replace(/\D/g, '');
  if (cpf.toString().length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let result = true;

  [9, 10].forEach((j) => {
    let sum = 0;
    let rest;

    cpf
      .split(/(?=)/)
      .splice(0, j)
      .forEach((e, i) => {
        sum += parseInt(e, 10) * (j + 2 - (i + 1));
      });

    rest = sum % 11;
    rest = rest < 2 ? 0 : 11 - rest;
    if (rest !== parseInt(cpf.substring(j, j + 1), 10)) result = false;
  });

  return result;
};
