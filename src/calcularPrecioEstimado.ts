function calcularPrecioEstimado(
  precioEnvio: number,
  precioProducto: number,
  precioTotal: number,
  tasaVentaMEP: number,
  tasaVentaTarjeta: number,
  tasaCompraMEP: number,
  tasaCompraTarjeta: number
): {
  totalMEP: number;
  totalTarjeta: number;
  refundMEP: number;
  refundTarjeta: number;
} {
  const costoEnvio = precioEnvio;
  const precioEnvioEnMEP = costoEnvio * tasaVentaMEP;
  const precioEnvioUsdTarjeta = costoEnvio * tasaVentaTarjeta;

  // Cálculo del precio real con impuestos
  const precioRealImpuestos = calcularImpuestos(precioProducto);

  // Cálculo de los totales y reembolsos
  const totalMEP = precioRealImpuestos * tasaVentaMEP + precioEnvioEnMEP;
  const totalTarjeta =
    precioRealImpuestos * tasaVentaTarjeta + precioEnvioUsdTarjeta;
  const potencialReembolsoMEP = precioTotal * tasaCompraMEP - totalMEP;
  const potencialReembolsoTarjeta =
    precioTotal * tasaCompraTarjeta - totalTarjeta;

  return {
    totalMEP,
    totalTarjeta,
    refundMEP: potencialReembolsoMEP,
    refundTarjeta: potencialReembolsoTarjeta,
  };
}
function calcularImpuestos(precioProducto: number): number {
  const arancel1 = 1.21;
  const arancel2 = 1.5;
  let precioProductoImpuestos: number;
  let excedente: number;

  if (precioProducto > 0 && precioProducto <= 400) {
    precioProductoImpuestos = precioProducto * arancel1;
  } 
  else {
    excedente = precioProducto - 400;
    precioProductoImpuestos = 484 + excedente * arancel2;
  }

  return precioProductoImpuestos;
}
