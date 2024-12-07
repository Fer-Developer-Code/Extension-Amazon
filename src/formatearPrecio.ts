function formatearNumero(numero: number): string {
  return numero.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}