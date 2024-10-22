async function getValorDollar() {
  try {
    const [responseMEP, responseTarjeta] = await Promise.all([
      fetch("https://dolarapi.com/v1/dolares/bolsa"),
      fetch("https://dolarapi.com/v1/dolares/tarjeta"),
    ]);

    const dataMEP = await responseMEP.json();
    const dataTarjeta = await responseTarjeta.json();

    const { productPrice: precioProducto, totalPrice: precioTotal } =
      getPrecioFromHTML();

    const { totalMEP, totalTarjeta, refundMEP, refundTarjeta } =
      calcularPrecioEstimado(
        precioProducto,
        precioTotal,
        dataMEP.venta,
        dataTarjeta.venta,
        dataMEP.compra,
        dataTarjeta.compra
      );

    mostrarResultado({
      totalMEPSinImp: totalMEP,
      totalTarjetaSinImp: totalTarjeta,
      precioProducto,
      precioTotalConEnvio: precioTotal,
      refundMEP,
      refundTarjeta,
      valorMepVenta: dataMEP.venta,
      valorTarjetaVenta: dataTarjeta.venta,
      valorMEPCompra: dataMEP.compra,
      valorTarjetaCompra: dataTarjeta.compra,
    });
  } catch (error) {
    console.error("Error al obtener los datos de la API", error);
    alert("Error al obtener los datos de los dólares");
  }
}
