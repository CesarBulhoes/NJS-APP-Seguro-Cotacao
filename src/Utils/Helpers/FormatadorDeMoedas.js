exports.formatarParaBRL = (valor) => {
  if (Number.isNaN(Number(valor))) return valor;
  return Number(valor).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
};
