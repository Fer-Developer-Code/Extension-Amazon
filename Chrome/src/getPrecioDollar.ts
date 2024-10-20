async function getValorDollar() {
  try {
    const [responseMEP, responseTarjeta] = await Promise.all([
      fetch("https://dolarapi.com/v1/dolares/bolsa"),
      fetch("https://dolarapi.com/v1/dolares/tarjeta"),
    ]);

    const dataMEP = await responseMEP.json();
    const dataTarjeta = await responseTarjeta.json();

    // Extraer precios
    const { productPrice: precioProducto, totalPrice: precioTotal } = getPrecioFromHTMLEspanol();

    // Calcular precios reales
    const { totalMEP, totalTarjeta, refundMEP, refundTarjeta } =
      calcularPrecioEstimado(
        precioProducto,
        precioTotal,
        dataMEP.venta,
        dataTarjeta.venta
      );

    // Mostrar resultados
    mostrarResultado({
      totalMEPSinImp: totalMEP,
      totalTarjetaSinImp: totalTarjeta,
      precioProducto: precioProducto,
      precioTotalConEnvio: precioTotal,
      refundMEP,
      refundTarjeta,
      valorMep: dataMEP.venta,
      valorTarjeta: dataTarjeta.venta,
    });
  } catch (error) {
    console.error("Error al obtener los datos de la API", error);
  }
}
