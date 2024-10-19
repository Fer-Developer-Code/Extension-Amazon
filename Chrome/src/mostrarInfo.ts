function mostrarResultado(results: {
  totalMEP: number;
  totalTarjeta: number;
  productPrice: number;
  totalPrice: number;
  refundMEP: number;
  refundTarjeta: number;
  mepRate: number;
  tarjetaRate: number;
}): void {
  const resultsRow = document.createElement("div");

  // Calcular el precio en MEP y tarjeta
  const productPriceMEP = results.productPrice * results.mepRate;
  const productPriceTarjeta = results.productPrice * results.tarjetaRate;
  const totalPriceMEP = results.totalPrice * results.mepRate;
  const totalPriceTarjeta = results.totalPrice * results.tarjetaRate;

  resultsRow.innerHTML = `
              <p style="padding: 10px;">Precio del Producto: <strong>US$${results.productPrice.toFixed(
                2
              )}</strong></p>
              <p style="padding: 10px;">Precio en MEP: <strong>ARS$${productPriceMEP.toFixed(
                2
              )}</strong></p>
              <p style="padding: 10px;">Precio en Tarjeta: <strong>ARS$${productPriceTarjeta.toFixed(
                2
              )}</strong></p>
              <p style="padding: 10px;">Total Estimado por Amazon: <strong>US$${results.totalPrice.toFixed(
                2
              )}</strong></p>
              <p style="padding: 10px;">Total Estimado en MEP: <strong>ARS$${totalPriceMEP.toFixed(
                2
              )}</strong></p>
              <p style="padding: 10px;">Total Estimado en Tarjeta: <strong>ARS$${totalPriceTarjeta.toFixed(
                2
              )}</strong></p>
              <p style="padding: 10px;">Precio en MEP + envio: <strong>ARS$${results.totalMEP.toFixed(
                2
              )}</strong></p>
              <p style="padding: 10px;">Precio en Tarjeta + envio: <strong>ARS$${results.totalTarjeta.toFixed(
                2
              )}</strong></p>
              <p style="padding: 10px;">Devolucion estimada en MEP: <strong>ARS$${results.refundMEP.toFixed(
                2
              )}</strong></p>
              <p style="padding: 10px;">Devolucion estimada en Tarjeta: <strong>ARS$${results.refundTarjeta.toFixed(
                2
              )}</strong></p>
          `;

  // Añadir la fila a la tabla existente o crear una nueva tabla si es necesario
  const existingTable = document.querySelector(".a-lineitem");
  if (existingTable) {
    existingTable.parentElement?.appendChild(resultsRow);
  }
}
