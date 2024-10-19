async function getValorDollar() {
  try {
    const [responseMEP, responseTarjeta] = await Promise.all([
      fetch("https://dolarapi.com/v1/dolares/bolsa"),
      fetch("https://dolarapi.com/v1/dolares/tarjeta"),
    ]);

    const dataMEP = await responseMEP.json();
    const dataTarjeta = await responseTarjeta.json();

    // Extraer precios
    const { productPrice, totalPrice } = getPrecio();

    // Calcular precios reales
    const { totalMEP, totalTarjeta, refundMEP, refundTarjeta } =
      calcularPrecioEstimado(
        productPrice,
        totalPrice,
        dataMEP.venta,
        dataTarjeta.venta
      );

    // Mostrar resultados
    mostrarResultado({
      totalMEP,
      totalTarjeta,
      productPrice,
      totalPrice,
      refundMEP,
      refundTarjeta,
      mepRate: dataMEP.venta,
      tarjetaRate: dataTarjeta.venta,
    });
  } catch (error) {
    console.error("Error al obtener los datos de la API", error);
  }
}
