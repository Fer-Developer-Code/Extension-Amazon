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
  const precioEnvioEnMEP = envioCost * mepRate;
  const precioEnvioUsdTarjeta = envioCost * tarjetaRate;

  // Calcular el precio real con impuestos
  const precioRealImpuestos =
    productPrice > 50 ? productPrice + (productPrice - 50) / 2 : productPrice;

  // Calcular totales en pesos
  const totalMEP = precioRealImpuestos * mepRate + precioEnvioEnMEP;
  const totalTarjeta = precioRealImpuestos * tarjetaRate + precioEnvioUsdTarjeta;

  // Calcular el reembolso potencial basado en el total estimado de Amazon
  const potencialReembolsoMEP = totalPrice * mepRate - totalMEP;
  const potencialReembolsoTarjeta = totalPrice * tarjetaRate - totalTarjeta;

  return {
    totalMEP,
    totalTarjeta,
    refundMEP: potencialReembolsoMEP,
    refundTarjeta: potencialReembolsoTarjeta,
  };
}
