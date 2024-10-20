function mostrarResultado(results: {
  totalMEPSinImp: number;
  totalTarjetaSinImp: number;
  precioProducto: number;
  precioTotalConEnvio: number;
  refundMEP: number;
  refundTarjeta: number;
  valorMep: number;
  valorTarjeta: number;
}): void {
  const resultsRow = document.createElement("div");

  // Calcular el precio en MEP y tarjeta
  const precioBaseProductoMEP = results.precioProducto * results.valorMep;
  const precioBaseProductoTarjeta =
    results.precioProducto * results.valorTarjeta;
  const precioTotalDolarMep = results.precioTotalConEnvio * results.valorMep;
  const precioTotalDolarTarjeta =
    results.precioTotalConEnvio * results.valorTarjeta;

  resultsRow.innerHTML = `
  <div class="results-container">
      <h2>Detalles del Producto</h2>
      <div class="price-details">
          <p><strong>Precio del Producto:</strong> US$${results.precioProducto.toFixed(
            2
          )}</p>
          <p><strong>Precio Base en Dólar MEP:</strong> ARS$${precioBaseProductoMEP.toFixed(
            2
          )}</p>
          <p><strong>Precio Base en Dólar Tarjeta:</strong> ARS$${precioBaseProductoTarjeta.toFixed(
            2
          )}</p>
      </div>
      <h2>Totales con Envío</h2>
      <div class="total-details">
          <p><strong>Total Estimado por Amazon con Envío:</strong> US$${results.precioTotalConEnvio.toFixed(
            2
          )}</p>
          <p><strong>Total Estimado en MEP con Envío:</strong> ARS$${precioTotalDolarMep.toFixed(
            2
          )}</p>
          <p><strong>Total Estimado en Tarjeta con Envío:</strong> ARS$${precioTotalDolarTarjeta.toFixed(
            2
          )}</p>
      </div>
      <h2>Precios reales sin aduana</h2>
      <div class="potential-details">
          <p><strong>Precio sin aduana en MEP + Envío:</strong> ARS$${results.totalMEPSinImp.toFixed(
            2
          )}</p>
          <p><strong>Precio sin aduana en Tarjeta + Envío:</strong> ARS$${results.totalTarjetaSinImp.toFixed(
            2
          )}</p>
      </div>
      <h2>Devoluciones Estimadas</h2>
      <div class="refund-details">
          <p><strong>Devolución Estimada en MEP:</strong> ARS$${results.refundMEP.toFixed(
            2
          )}</p>
          <p><strong>Devolución Estimada en Tarjeta:</strong> ARS$${results.refundTarjeta.toFixed(
            2
          )}</p>
          <p class="disclaimer">*Este devolucion aplica solo si ha realizado menos de 5 pedidos internacionales o si el monto total no supera los US$1,000 en el año.</p>
      </div>
  </div>
`;

  // Añadir la fila a la tabla existente o crear una nueva tabla si es necesario
  const existingTable = document.querySelector(".a-lineitem");
  if (existingTable) {
    existingTable.parentElement?.appendChild(resultsRow);
  }
}
