"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function getValorDollar() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [responseMEP, responseTarjeta] = yield Promise.all([
                fetch("https://dolarapi.com/v1/dolares/bolsa"),
                fetch("https://dolarapi.com/v1/dolares/tarjeta"),
            ]);
            const dataMEP = yield responseMEP.json();
            const dataTarjeta = yield responseTarjeta.json();
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
    });
}
function getPrecioFromHTMLEspanol() {
    var _a, _b;
    // Selecciona el elemento que contiene el precio del producto
    const priceElement = document.querySelector(".a-price .a-offscreen");
    const totalPriceElement = document.querySelector("table.a-lineitem tbody tr:last-child td:nth-child(3) span");
    const productPrice = priceElement
        ? parseFloat(((_a = priceElement.textContent) === null || _a === void 0 ? void 0 : _a.replace("US$", "").replace(",", "").trim()) ||
            "0")
        : 0;
    const totalPrice = totalPriceElement
        ? parseFloat(((_b = totalPriceElement.textContent) === null || _b === void 0 ? void 0 : _b.replace("US$", "").replace(",", "").trim()) || "0")
        : 0;
    return { productPrice, totalPrice };
}
function mostrarResultado(results) {
    var _a;
    const resultsRow = document.createElement("div");
    // Calcular el precio en MEP y tarjeta
    const precioBaseProductoMEP = results.precioProducto * results.valorMep;
    const precioBaseProductoTarjeta = results.precioProducto * results.valorTarjeta;
    const precioTotalDolarMep = results.precioTotalConEnvio * results.valorMep;
    const precioTotalDolarTarjeta = results.precioTotalConEnvio * results.valorTarjeta;
    resultsRow.innerHTML = `
  <div class="results-container">
      <h2>Detalles del Producto</h2>
      <div class="price-details">
          <p><strong>Precio del Producto:</strong> US$${results.precioProducto.toFixed(2)}</p>
          <p><strong>Precio Base en Dólar MEP:</strong> ARS$${precioBaseProductoMEP.toFixed(2)}</p>
          <p><strong>Precio Base en Dólar Tarjeta:</strong> ARS$${precioBaseProductoTarjeta.toFixed(2)}</p>
      </div>
      <h2>Totales con Envío</h2>
      <div class="total-details">
          <p><strong>Total Estimado por Amazon con Envío:</strong> US$${results.precioTotalConEnvio.toFixed(2)}</p>
          <p><strong>Total Estimado en MEP con Envío:</strong> ARS$${precioTotalDolarMep.toFixed(2)}</p>
          <p><strong>Total Estimado en Tarjeta con Envío:</strong> ARS$${precioTotalDolarTarjeta.toFixed(2)}</p>
      </div>
      <h2>Precios reales sin aduana</h2>
      <div class="potential-details">
          <p><strong>Precio sin aduana en MEP + Envío:</strong> ARS$${results.totalMEPSinImp.toFixed(2)}</p>
          <p><strong>Precio sin aduana en Tarjeta + Envío:</strong> ARS$${results.totalTarjetaSinImp.toFixed(2)}</p>
      </div>
      <h2>Devoluciones Estimadas</h2>
      <div class="refund-details">
          <p><strong>Devolución Estimada en MEP:</strong> ARS$${results.refundMEP.toFixed(2)}</p>
          <p><strong>Devolución Estimada en Tarjeta:</strong> ARS$${results.refundTarjeta.toFixed(2)}</p>
          <p class="disclaimer">*Este devolucion aplica solo si ha realizado menos de 5 pedidos internacionales o si el monto total no supera los US$1,000 en el año.</p>
      </div>
  </div>
`;
    // Añadir la fila a la tabla existente o crear una nueva tabla si es necesario
    const existingTable = document.querySelector(".a-lineitem");
    if (existingTable) {
        (_a = existingTable.parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(resultsRow);
    }
}
