function mostrarResultado(resultados: {
  precioEnvio: number;
  totalMEPSinImp: number;
  totalTarjetaSinImp: number;
  precioProducto: number;
  precioTotalConEnvio: number;
  refundMEP: number;
  refundTarjeta: number;
  valorMEPVenta: number;
  valorTarjetaVenta: number;
  valorMEPCompra: number;
  valorTarjetaCompra: number;
}): void {
  const filaResultados = document.createElement("section");
  const filaPrecios = document.createElement("section");

  // Cálculo de precios
  const precioBaseProductoMEP =
    resultados.precioProducto * resultados.valorMEPVenta;
  const precioBaseProductoTarjeta =
    resultados.precioProducto * resultados.valorTarjetaVenta;
  const precioTotalDolarMep =
    resultados.precioTotalConEnvio * resultados.valorMEPVenta;
  const precioTotalDolarTarjeta =
    resultados.precioTotalConEnvio * resultados.valorTarjetaVenta;

  // Construcción del HTML
  const contenidoHTMLDetalles = `
    <div class="results-container">
      <h2>Detalles del Producto</h2>
      <div class="price-details">
        <p><strong>Precio del Producto:</strong> US$ ${formatearNumero(
          resultados.precioProducto
        )}</p>
        <p><strong>Precio Base en Dólar MEP:</strong> ARS$ ${formatearNumero(
          precioBaseProductoMEP
        )}</p>
        <p><strong>Precio Base en Dólar Tarjeta:</strong> ARS$ ${formatearNumero(
          precioBaseProductoTarjeta
        )}</p>
      </div>
      <h2>Totales con Envío</h2>
      <div class="total-details">
        <p><strong>Total Estimado por Amazon con Envío:</strong> US$ ${formatearNumero(
          resultados.precioTotalConEnvio
        )}</p>
        <p><strong>Total Estimado en MEP con Envío:</strong> ARS$ ${formatearNumero(
          precioTotalDolarMep
        )}</p>
        <p><strong>Total Estimado en Tarjeta con Envío:</strong> ARS$ ${formatearNumero(
          precioTotalDolarTarjeta
        )}</p>
      </div>
      <h2>Precios reales sin aduana</h2>
      <div class="potential-details">
        <p><strong>Precio sin aduana en MEP + Envío:</strong> ARS$ ${formatearNumero(
          resultados.totalMEPSinImp
        )}</p>
        <p><strong>Precio sin aduana en Tarjeta + Envío:</strong> ARS$ ${formatearNumero(
          resultados.totalTarjetaSinImp
        )}</p>
      </div>
      <h2>Devoluciones Estimadas</h2>
      <div class="refund-details">
        <p><strong>Devolución Estimada en MEP:</strong> ARS$ ${formatearNumero(
          resultados.refundMEP
        )}</p>
        <p><strong>Devolución Estimada en Tarjeta:</strong> ARS$ ${formatearNumero(
          resultados.refundTarjeta
        )}</p>
        <p class="disclaimer">*Esta devolución aplica solo si ha realizado menos de 5 pedidos internacionales o si el monto total no supera los US$ 3,000 en el año.</p>
      </div>
    </div>`;

  // Asignación del contenido al contenedor
  filaResultados.innerHTML = contenidoHTMLDetalles;
  const tablaExistente = document.querySelector(".a-lineitem");
  tablaExistente?.parentElement?.appendChild(filaResultados);
  const precio = document.querySelector(".a-price.aok-align-center");
  const contenidoHTMLPrecio = `<div>
        <p><strong>Total Estimado por Amazon con Envío:</strong> US$ ${formatearNumero(
          resultados.precioTotalConEnvio
        )}</p>
        <p><strong>Total Estimado en MEP con Envío:</strong> ARS$ ${formatearNumero(
          precioTotalDolarMep
        )}</p>
        <p><strong>Total Estimado en Tarjeta con Envío:</strong> ARS$ ${formatearNumero(
          precioTotalDolarTarjeta
        )}</p>
      </div>
      <div>
      <p>Precio dolar tarjeta: 1 USD = ARS$ ${formatearNumero(resultados.valorTarjetaVenta)}</p>
      <p>Precio dolar MEP: 1 USD = ${formatearNumero(resultados.valorMEPVenta)}</p>
      </div>`;
  filaPrecios.innerHTML = contenidoHTMLPrecio;
  precio?.parentElement?.appendChild(filaPrecios);
}
