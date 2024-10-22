"use strict";
function calcularPrecioEstimado(precioProducto, precioTotal, mepRateVenta, tarjetaRateVenta, mepRateCompra, tarjetaRateCompra) {
    const envioCost = 5;
    const precioEnvioEnMEP = envioCost * mepRateVenta;
    const precioEnvioUsdTarjeta = envioCost * tarjetaRateVenta;
    const precioRealImpuestos = precioProducto > 50
        ? precioProducto + (precioProducto - 50) / 2
        : precioProducto;
    const totalMEP = precioRealImpuestos * mepRateVenta + precioEnvioEnMEP;
    const totalTarjeta = precioRealImpuestos * tarjetaRateVenta + precioEnvioUsdTarjeta;
    const potencialReembolsoMEP = precioTotal * mepRateCompra - totalMEP;
    const potencialReembolsoTarjeta = precioTotal * tarjetaRateCompra - totalTarjeta;
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
    return number.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
async function getValorDollar() {
    try {
        const [responseMEP, responseTarjeta] = await Promise.all([
            fetch("https://dolarapi.com/v1/dolares/bolsa"),
            fetch("https://dolarapi.com/v1/dolares/tarjeta"),
        ]);
        const dataMEP = await responseMEP.json();
        const dataTarjeta = await responseTarjeta.json();
        const { productPrice: precioProducto, totalPrice: precioTotal } = getPrecioFromHTML();
        const { totalMEP, totalTarjeta, refundMEP, refundTarjeta } = calcularPrecioEstimado(precioProducto, precioTotal, dataMEP.venta, dataTarjeta.venta, dataMEP.compra, dataTarjeta.compra);
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
    }
    catch (error) {
        console.error("Error al obtener los datos de la API", error);
        alert("Error al obtener los datos de los dólares");
    }
}
function getPrecioFromHTML() {
    var _a, _b;
    const priceElement = document.querySelector(".a-price .a-offscreen");
    const totalPriceElement = document.querySelector("table.a-lineitem tbody tr:last-child td:nth-child(3) span");
    const productPrice = priceElement
        ? parseFloat(((_a = priceElement.textContent) === null || _a === void 0 ? void 0 : _a.replace(/[^0-9.]/g, "")) || "0")
        : 0;
    const totalPrice = totalPriceElement
        ? parseFloat(((_b = totalPriceElement.textContent) === null || _b === void 0 ? void 0 : _b.replace(/[^0-9.]/g, "")) || "0")
        : 0;
    return { productPrice, totalPrice };
}
function mostrarResultado(results) {
    var _a;
    const resultsRow = document.createElement("div");
    const precioBaseProductoMEP = results.precioProducto * results.valorMepVenta;
    const precioBaseProductoTarjeta = results.precioProducto * results.valorTarjetaVenta;
    const precioTotalDolarMep = results.precioTotalConEnvio * results.valorMepVenta;
    const precioTotalDolarTarjeta = results.precioTotalConEnvio * results.valorTarjetaVenta;
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
    const existingTable = document.querySelector(".a-lineitem");
    (_a = existingTable === null || existingTable === void 0 ? void 0 : existingTable.parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(resultsRow);
}
