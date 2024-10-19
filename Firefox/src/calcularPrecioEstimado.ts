function calcularPrecioEstimado(
  productPrice: number,
  totalPrice: number,
  mepRate: number,
  tarjetaRate: number
): {
  totalMEP: number;
  totalTarjeta: number;
  refundMEP: number;
  refundTarjeta: number;
} {
  const envioCost = 5; // Costos de envío
  const precioEnvioMep = envioCost * mepRate;
  const precioEnvioTarjeta = envioCost * tarjetaRate;

  // Calcular el precio real con impuestos
  const precioRealImpuestos =
    productPrice > 50 ? productPrice + (productPrice - 50) / 2 : productPrice;

  // Calcular totales en pesos
  const totalMEP = precioRealImpuestos * mepRate + precioEnvioMep;
  const totalTarjeta = precioRealImpuestos * tarjetaRate + precioEnvioTarjeta;

  // Calcular el reembolso potencial basado en el total estimado de Amazon
  const refundMEP = totalPrice * mepRate - totalMEP;
  const refundTarjeta = totalPrice * tarjetaRate - totalTarjeta;

  return {
    totalMEP,
    totalTarjeta,
    refundMEP,
    refundTarjeta,
  };
}
