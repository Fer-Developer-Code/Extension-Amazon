function mostrarResultado(results: {
  totalMEPSinImp: number;
  totalTarjetaSinImp: number;
  precioProducto: number;
  precioTotalConEnvio: number;
  refundMEP: number;
  refundTarjeta: number;
  valorMepVenta: number;
  valorTarjetaVenta: number;
  valorMEPCompra: number;
  valorTarjetaCompra: number;
}): void {
  const resultsRow = document.createElement("div");

  const precioBaseProductoMEP = results.precioProducto * results.valorMepVenta;
  const precioBaseProductoTarjeta =
    results.precioProducto * results.valorTarjetaVenta;
  const precioTotalDolarMep =
    results.precioTotalConEnvio * results.valorMepVenta;
  const precioTotalDolarTarjeta =
    results.precioTotalConEnvio * results.valorTarjetaVenta;

  const htmlContent = `
    <div class="results-container">
      <h2>Detalles del Producto</h2>
      <div class="price-details">
        <p><strong>Precio del Producto:</strong> US$ ${formatNumber(
          results.precioProducto
        )}</p>
        <p><strong>Precio Base en Dólar MEP:</strong> ARS$ ${formatNumber(
          precioBaseProductoMEP
        )}</p>
        <p><strong>Precio Base en Dólar Tarjeta:</strong> ARS$ ${formatNumber(
          precioBaseProductoTarjeta
        )}</p>
      </div>
      <h2>Totales con Envío</h2>
      <div class="total-details">
        <p><strong>Total Estimado por Amazon con Envío:</strong> US$ ${formatNumber(
          results.precioTotalConEnvio
        )}</p>
        <p><strong>Total Estimado en MEP con Envío:</strong> ARS$ ${formatNumber(
          precioTotalDolarMep
        )}</p>
        <p><strong>Total Estimado en Tarjeta con Envío:</strong> ARS$ ${formatNumber(
          precioTotalDolarTarjeta
        )}</p>
      </div>
      <h2>Precios reales sin aduana</h2>
      <div class="potential-details">
        <p><strong>Precio sin aduana en MEP + Envío:</strong> ARS$ ${formatNumber(
          results.totalMEPSinImp
        )}</p>
        <p><strong>Precio sin aduana en Tarjeta + Envío:</strong> ARS$ ${formatNumber(
          results.totalTarjetaSinImp
        )}</p>
      </div>
      <h2>Devoluciones Estimadas</h2>
      <div class="refund-details">
        <p><strong>Devolución Estimada en MEP:</strong> ARS$ ${formatNumber(
          results.refundMEP
        )}</p>
        <p><strong>Devolución Estimada en Tarjeta:</strong> ARS$ ${formatNumber(
          results.refundTarjeta
        )}</p>
        <p class="disclaimer">*Esta devolución aplica solo si ha realizado menos de 5 pedidos internacionales o si el monto total no supera los US$ 3,000 en el año.</p>
      </div>
    </div>`;

  resultsRow.innerHTML = htmlContent;
  const existingTable = document.querySelector(".a-lineitem");
  existingTable?.parentElement?.appendChild(resultsRow);
}