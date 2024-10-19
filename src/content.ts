// Función para extraer el precio del producto y el precio total de Amazon
function getPricesFromHTML(): { productPrice: number; totalPrice: number } {
  // Selecciona el elemento que contiene el precio del producto
  const priceElement = document.querySelector(".a-price .a-offscreen");
  const totalPriceElement = document.querySelector(
    "table.a-lineitem tbody tr:last-child td:nth-child(3) span"
  );

  const productPrice = priceElement
    ? parseFloat(
        priceElement.textContent?.replace("US$", "").replace(",", "").trim() ||
          "0"
      )
    : 0;

  const totalPrice = totalPriceElement
    ? parseFloat(
        totalPriceElement.textContent
          ?.replace("US$", "")
          .replace(",", "")
          .trim() || "0"
      )
    : 0;

  return { productPrice, totalPrice };
}

// Función para calcular el precio real
function calculateRealPrice(
  productPrice: number,
  totalPrice: number,
  mepRate: number,
  tarjetaRate: number
): {
  totalMEP: number;
  totalTarjeta: number;
  refundMEP: number;
  refundTarjeta: number;
} {
  const envioCost = 5; // Costos de envío
  const precioEnvioMep = envioCost * mepRate;
  const precioEnvioTarjeta = envioCost * tarjetaRate;

  // Calcular el precio real con impuestos
  const precioRealImpuestos =
    productPrice > 50 ? productPrice + (productPrice - 50) / 2 : productPrice;

  // Calcular totales en pesos
  const totalMEP = precioRealImpuestos * mepRate + precioEnvioMep;
  const totalTarjeta = precioRealImpuestos * tarjetaRate + precioEnvioTarjeta;

  // Calcular el reembolso potencial basado en el total estimado de Amazon
  const refundMEP = totalPrice * mepRate - totalMEP;
  const refundTarjeta = totalPrice * tarjetaRate - totalTarjeta;

  return {
    totalMEP,
    totalTarjeta,
    refundMEP,
    refundTarjeta,
  };
}

// Función para mostrar la información calculada
function displayResults(results: {
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

// Obtener precios del dólar y calcular precios
async function fetchDollarRates() {
  try {
    const [responseMEP, responseTarjeta] = await Promise.all([
      fetch("https://dolarapi.com/v1/dolares/bolsa"),
      fetch("https://dolarapi.com/v1/dolares/tarjeta"),
    ]);

    const dataMEP = await responseMEP.json();
    const dataTarjeta = await responseTarjeta.json();

    // Extraer precios
    const { productPrice, totalPrice } = getPricesFromHTML();

    // Calcular precios reales
    const { totalMEP, totalTarjeta, refundMEP, refundTarjeta } =
      calculateRealPrice(
        productPrice,
        totalPrice,
        dataMEP.venta,
        dataTarjeta.venta
      );

    // Mostrar resultados
    // Mostrar resultados
    displayResults({
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

// Ejecutar al cargar la página
fetchDollarRates();
