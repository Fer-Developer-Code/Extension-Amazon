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
// Función para extraer el precio del producto y el precio total de Amazon
function getPricesFromHTML() {
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
// Función para calcular el precio real
function calculateRealPrice(productPrice, totalPrice, mepRate, tarjetaRate) {
    const envioCost = 5; // Costos de envío
    const precioEnvioMep = envioCost * mepRate;
    const precioEnvioTarjeta = envioCost * tarjetaRate;
    // Calcular el precio real con impuestos
    const precioRealImpuestos = productPrice > 50 ? productPrice + (productPrice - 50) / 2 : productPrice;
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
function displayResults(results) {
    var _a;
    const resultsRow = document.createElement("div");
    // Calcular el precio en MEP y tarjeta
    const productPriceMEP = results.productPrice * results.mepRate;
    const productPriceTarjeta = results.productPrice * results.tarjetaRate;
    const totalPriceMEP = results.totalPrice * results.mepRate;
    const totalPriceTarjeta = results.totalPrice * results.tarjetaRate;
    resultsRow.innerHTML = `
            <p style="padding: 10px;">Precio del Producto: <strong>US$${results.productPrice.toFixed(2)}</strong></p>
            <p style="padding: 10px;">Precio en MEP: <strong>ARS$${productPriceMEP.toFixed(2)}</strong></p>
            <p style="padding: 10px;">Precio en Tarjeta: <strong>ARS$${productPriceTarjeta.toFixed(2)}</strong></p>
            <p style="padding: 10px;">Total Estimado por Amazon: <strong>US$${results.totalPrice.toFixed(2)}</strong></p>
            <p style="padding: 10px;">Total Estimado en MEP: <strong>ARS$${totalPriceMEP.toFixed(2)}</strong></p>
            <p style="padding: 10px;">Total Estimado en Tarjeta: <strong>ARS$${totalPriceTarjeta.toFixed(2)}</strong></p>
            <p style="padding: 10px;">Precio en MEP + envio: <strong>ARS$${results.totalMEP.toFixed(2)}</strong></p>
            <p style="padding: 10px;">Precio en Tarjeta + envio: <strong>ARS$${results.totalTarjeta.toFixed(2)}</strong></p>
            <p style="padding: 10px;">Devolucion estimada en MEP: <strong>ARS$${results.refundMEP.toFixed(2)}</strong></p>
            <p style="padding: 10px;">Devolucion estimada en Tarjeta: <strong>ARS$${results.refundTarjeta.toFixed(2)}</strong></p>
        `;
    // Añadir la fila a la tabla existente o crear una nueva tabla si es necesario
    const existingTable = document.querySelector(".a-lineitem");
    if (existingTable) {
        (_a = existingTable.parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(resultsRow);
    }
}
// Obtener precios del dólar y calcular precios
function fetchDollarRates() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [responseMEP, responseTarjeta] = yield Promise.all([
                fetch("https://dolarapi.com/v1/dolares/bolsa"),
                fetch("https://dolarapi.com/v1/dolares/tarjeta"),
            ]);
            const dataMEP = yield responseMEP.json();
            const dataTarjeta = yield responseTarjeta.json();
            // Extraer precios
            const { productPrice, totalPrice } = getPricesFromHTML();
            // Calcular precios reales
            const { totalMEP, totalTarjeta, refundMEP, refundTarjeta } = calculateRealPrice(productPrice, totalPrice, dataMEP.venta, dataTarjeta.venta);
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
        }
        catch (error) {
            console.error("Error al obtener los datos de la API", error);
        }
    });
}
// Ejecutar al cargar la página
fetchDollarRates();
