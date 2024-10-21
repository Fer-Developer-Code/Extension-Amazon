"use strict";
function calcularPrecioEstimado(productPrice, totalPrice, mepRate, tarjetaRate) {
    const envioCost = 5; // Costos de envío
    const precioEnvioEnMEP = envioCost * mepRate;
    const precioEnvioUsdTarjeta = envioCost * tarjetaRate;
    // Calcular el precio real con impuestos
    const precioRealImpuestos = productPrice > 50 ? productPrice + (productPrice - 50) / 2 : productPrice;
    // Calcular totales en pesos
    const totalMEP = precioRealImpuestos * mepRate + precioEnvioEnMEP;
    const totalTarjeta = precioRealImpuestos * tarjetaRate + precioEnvioUsdTarjeta;
    // Calcular el reembolso potencial basado en el total estimado de Amazon
    const potencialReembolsoMEP = totalPrice * mepRate - totalMEP;
    const potencialReembolsoTarjeta = totalPrice * tarjetaRate - totalTarjeta;
    return {
        totalMEP,
        totalTarjeta,
        refundMEP: potencialReembolsoMEP,
        refundTarjeta: potencialReembolsoTarjeta,
    };
}
getValorDollar();
// Función para agregar separadores de miles
function formatNumber(number) {
    return number.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
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
        const { totalMEP, totalTarjeta, refundMEP, refundTarjeta } = calcularPrecioEstimado(precioProducto, precioTotal, dataMEP.venta, dataTarjeta.venta);
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
    }
    catch (error) {
        console.error("Error al obtener los datos de la API", error);
    }
}
function getPrecioFromHTMLEspanol() {
    // Selecciona el elemento que contiene el precio del producto
    const priceElement = document.querySelector(".a-price .a-offscreen");
    const totalPriceElement = document.querySelector("table.a-lineitem tbody tr:last-child td:nth-child(3) span");
    const productPrice = priceElement
        ? parseFloat(priceElement.textContent?.replace("US$", "").replace(",", "").trim() ||
            "0")
        : 0;
    const totalPrice = totalPriceElement
        ? parseFloat(totalPriceElement.textContent
            ?.replace("US$", "")
            .replace(",", "")
            .trim() || "0")
        : 0;
    return { productPrice, totalPrice };
}
function mostrarResultado(results) {
    const resultsRow = document.createElement("div");
    // Calcular el precio en MEP y Tarjeta
    const precioBaseProductoMEP = results.precioProducto * results.valorMep;
    const precioBaseProductoTarjeta = results.precioProducto * results.valorTarjeta;
    const precioTotalDolarMep = results.precioTotalConEnvio * results.valorMep;
    const precioTotalDolarTarjeta = results.precioTotalConEnvio * results.valorTarjeta;
    // Contenido HTML con separadores de miles
    const htmlContent = `
    <div class="results-container">
      <h2>Detalles del Producto</h2>
      <div class="price-details">
        <p><strong>Precio del Producto:</strong> US$ ${formatNumber(results.precioProducto)}</p>
        <p><strong>Precio Base en Dólar MEP:</strong> ARS$ ${formatNumber(precioBaseProductoMEP)}</p>
        <p><strong>Precio Base en Dólar Tarjeta:</strong> ARS$ ${formatNumber(precioBaseProductoTarjeta)}</p>
      </div>
      <h2>Totales con Envío</h2>
      <div class="total-details">
        <p><strong>Total Estimado por Amazon con Envío:</strong> US$ ${formatNumber(results.precioTotalConEnvio)}</p>
        <p><strong>Total Estimado en MEP con Envío:</strong> ARS$ ${formatNumber(precioTotalDolarMep)}</p>
        <p><strong>Total Estimado en Tarjeta con Envío:</strong> ARS$ ${formatNumber(precioTotalDolarTarjeta)}</p>
      </div>
      <h2>Precios reales sin aduana</h2>
      <div class="potential-details">
        <p><strong>Precio sin aduana en MEP + Envío:</strong> ARS$ ${formatNumber(results.totalMEPSinImp)}</p>
        <p><strong>Precio sin aduana en Tarjeta + Envío:</strong> ARS$ ${formatNumber(results.totalTarjetaSinImp)}</p>
      </div>
      <h2>Devoluciones Estimadas</h2>
      <div class="refund-details">
        <p><strong>Devolución Estimada en MEP:</strong> ARS$ ${formatNumber(results.refundMEP)}</p>
        <p><strong>Devolución Estimada en Tarjeta:</strong> ARS$ ${formatNumber(results.refundTarjeta)}</p>
        <p class="disclaimer">*Esta devolución aplica solo si ha realizado menos de 5 pedidos internacionales o si el monto total no supera los US$ 1,000 en el año.</p>
      </div>
    </div>`;
    resultsRow.innerHTML = htmlContent;
    // Añadir la fila a la tabla existente o crear una nueva tabla si es necesario
    const existingTable = document.querySelector(".a-lineitem");
    if (existingTable) {
        existingTable.parentElement?.appendChild(resultsRow);
    }
}
