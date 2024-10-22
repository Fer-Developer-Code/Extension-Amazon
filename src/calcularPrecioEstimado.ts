function calcularPrecioEstimado(
  precioProducto: number,
  precioTotal: number,
  mepRateVenta: number,
  tarjetaRateVenta: number,
  mepRateCompra: number,
  tarjetaRateCompra: number
): {
  totalMEP: number;
  totalTarjeta: number;
  refundMEP: number;
  refundTarjeta: number;
} {
  const envioCost = 5;
  const precioEnvioEnMEP = envioCost * mepRateVenta;
  const precioEnvioUsdTarjeta = envioCost * tarjetaRateVenta;

  const precioRealImpuestos =
    precioProducto > 50
      ? precioProducto + (precioProducto - 50) / 2
      : precioProducto;

  const totalMEP = precioRealImpuestos * mepRateVenta + precioEnvioEnMEP;
  const totalTarjeta =
    precioRealImpuestos * tarjetaRateVenta + precioEnvioUsdTarjeta;

  const potencialReembolsoMEP = precioTotal * mepRateCompra - totalMEP;
  const potencialReembolsoTarjeta =
    precioTotal * tarjetaRateCompra - totalTarjeta;

  return {
    totalMEP,
    totalTarjeta,
    refundMEP: potencialReembolsoMEP,
    refundTarjeta: potencialReembolsoTarjeta,
  };
}