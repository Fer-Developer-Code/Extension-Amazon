async function obtenerValorDolar() {
  try {
    const [respuestaMEP, respuestaTarjeta] = await Promise.all([
      fetch("https://dolarapi.com/v1/dolares/bolsa"),
      fetch("https://dolarapi.com/v1/dolares/tarjeta"),
    ]);

    const datosMEP = await respuestaMEP.json();
    const datosTarjeta = await respuestaTarjeta.json();

    // Obtención de precios desde el HTML
    const { precioProducto, precioEnvio, precioTotal } = obtenerPrecioDesdeHTML();

    // Cálculo de precios estimados
    const { totalMEP, totalTarjeta, refundMEP, refundTarjeta } = calcularPrecioEstimado(
      precioEnvio, precioProducto, precioTotal, 
      datosMEP.venta, datosTarjeta.venta, 
      datosMEP.compra, datosTarjeta.compra
    );

    // Mostrar resultados
    mostrarResultado({
      precioEnvio: precioEnvio,
      totalMEPSinImp: totalMEP,
      totalTarjetaSinImp: totalTarjeta,
      precioProducto,
      precioTotalConEnvio: precioTotal,
      refundMEP,
      refundTarjeta,
      valorMEPVenta: datosMEP.venta,
      valorTarjetaVenta: datosTarjeta.venta,
      valorMEPCompra: datosMEP.compra,
      valorTarjetaCompra: datosTarjeta.compra,
    });
  } catch (error) {
    console.error("Error al obtener los datos de la API", error);
    alert("Error al obtener los datos de los dólares");
  }
}