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
function calcularPrecioEstimado(precioEnvio, precioProducto, precioTotal, tasaVentaMEP, tasaVentaTarjeta, tasaCompraMEP, tasaCompraTarjeta) {
    const costoEnvio = precioEnvio;
    const precioEnvioEnMEP = costoEnvio * tasaVentaMEP;
    const precioEnvioUsdTarjeta = costoEnvio * tasaVentaTarjeta;
    // Cálculo del precio real con impuestos
    const precioRealImpuestos = calcularImpuestos(precioProducto);
    // Cálculo de los totales y reembolsos
    const totalMEP = precioRealImpuestos * tasaVentaMEP + precioEnvioEnMEP;
    const totalTarjeta = precioRealImpuestos * tasaVentaTarjeta + precioEnvioUsdTarjeta;
    const potencialReembolsoMEP = precioTotal * tasaCompraMEP - totalMEP;
    const potencialReembolsoTarjeta = precioTotal * tasaCompraTarjeta - totalTarjeta;
    return {
        totalMEP,
        totalTarjeta,
        refundMEP: potencialReembolsoMEP,
        refundTarjeta: potencialReembolsoTarjeta,
    };
}
function calcularImpuestos(precioProducto) {
    const arancel1 = 1.21;
    const arancel2 = 1.5;
    let precioProductoImpuestos;
    let excedente;
    if (precioProducto > 0 && precioProducto <= 400) {
        precioProductoImpuestos = precioProducto * arancel1;
    }
    else {
        excedente = precioProducto - 400;
        precioProductoImpuestos = 484 + excedente * arancel2;
    }
    return precioProductoImpuestos;
}
document.addEventListener("DOMContentLoaded", () => {
    const botonesDetalles = document.querySelectorAll('a.a-popover-trigger.a-declarative span.a-size-base');
    botonesDetalles.forEach((boton) => {
        boton.addEventListener("click", () => obtenerValorDolar());
    });
});
function formatearNumero(numero) {
    return numero.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
function obtenerValorDolar() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [respuestaMEP, respuestaTarjeta] = yield Promise.all([
                fetch("https://dolarapi.com/v1/dolares/bolsa"),
                fetch("https://dolarapi.com/v1/dolares/tarjeta"),
            ]);
            const datosMEP = yield respuestaMEP.json();
            const datosTarjeta = yield respuestaTarjeta.json();
            // Obtención de precios desde el HTML
            const { precioProducto, precioEnvio, precioTotal } = obtenerPrecioDesdeHTML();
            // Cálculo de precios estimados
            const { totalMEP, totalTarjeta, refundMEP, refundTarjeta } = calcularPrecioEstimado(precioEnvio, precioProducto, precioTotal, datosMEP.venta, datosTarjeta.venta, datosMEP.compra, datosTarjeta.compra);
            // Mostrar resultados
            mostrarResultado({
                totalMEPSinImp: totalMEP,
                totalTarjetaSinImp: totalTarjeta,
                precioProducto,
                precioTotalConEnvio: precioTotal,
                refundMEP,
                refundTarjeta,
                valorMepVenta: datosMEP.venta,
                valorTarjetaVenta: datosTarjeta.venta,
                valorMEPCompra: datosMEP.compra,
                valorTarjetaCompra: datosTarjeta.compra,
            });
        }
        catch (error) {
            console.error("Error al obtener los datos de la API", error);
            alert("Error al obtener los datos de los dólares");
        }
    });
}
function obtenerPrecioDesdeHTML() {
    const elementoPrecio = document.querySelector(".a-price .a-offscreen");
    const elementoPrecioEnvio = document.querySelector("table.a-lineitem tbody tr:nth-child(2) td:nth-child(3) span");
    const elementoPrecioTotal = document.querySelector("table.a-lineitem tbody tr:last-child td:nth-child(3) span");
    // Obtención de precios desde el HTML
    return {
        precioProducto: obtenerPrecioProducto(elementoPrecio),
        precioEnvio: obtenerPrecioEnvio(elementoPrecioEnvio),
        precioTotal: obtenerPrecioTotal(elementoPrecioTotal),
    };
}
function obtenerPrecioProducto(elemento) {
    var _a;
    return elemento ? parseFloat(((_a = elemento.textContent) === null || _a === void 0 ? void 0 : _a.replace(/[^0-9.]/g, "")) || "0") : 0;
}
function obtenerPrecioEnvio(elemento) {
    var _a, _b;
    if (elemento) {
        const texto = (_a = elemento.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        return texto === "gratis" || texto === "free" ? 0 : parseFloat(((_b = elemento.textContent) === null || _b === void 0 ? void 0 : _b.replace(/[^0-9.]/g, "")) || "0");
    }
    return 0;
}
function obtenerPrecioTotal(elemento) {
    var _a;
    return elemento ? parseFloat(((_a = elemento.textContent) === null || _a === void 0 ? void 0 : _a.replace(/[^0-9.]/g, "")) || "0") : 0;
}
function mostrarResultado(resultados) {
    var _a;
    const filaResultados = document.createElement("section");
    // Cálculo de precios
    const precioBaseProductoMEP = resultados.precioProducto * resultados.valorMepVenta;
    const precioBaseProductoTarjeta = resultados.precioProducto * resultados.valorTarjetaVenta;
    const precioTotalDolarMep = resultados.precioTotalConEnvio * resultados.valorMepVenta;
    const precioTotalDolarTarjeta = resultados.precioTotalConEnvio * resultados.valorTarjetaVenta;
    // Construcción del HTML
    const contenidoHTML = `
    <div class="results-container">
      <h2>Detalles del Producto</h2>
      <div class="price-details">
        <p><strong>Precio del Producto:</strong> US$ ${formatearNumero(resultados.precioProducto)}</p>
        <p><strong>Precio Base en Dólar MEP:</strong> ARS$ ${formatearNumero(precioBaseProductoMEP)}</p>
        <p><strong>Precio Base en Dólar Tarjeta:</strong> ARS$ ${formatearNumero(precioBaseProductoTarjeta)}</p>
      </div>
      <h2>Totales con Envío</h2>
      <div class="total-details">
        <p><strong>Total Estimado por Amazon con Envío:</strong> US$ ${formatearNumero(resultados.precioTotalConEnvio)}</p>
        <p><strong>Total Estimado en MEP con Envío:</strong> ARS$ ${formatearNumero(precioTotalDolarMep)}</p>
        <p><strong>Total Estimado en Tarjeta con Envío:</strong> ARS$ ${formatearNumero(precioTotalDolarTarjeta)}</p>
      </div>
      <h2>Precios reales sin aduana</h2>
      <div class="potential-details">
        <p><strong>Precio sin aduana en MEP + Envío:</strong> ARS$ ${formatearNumero(resultados.totalMEPSinImp)}</p>
        <p><strong>Precio sin aduana en Tarjeta + Envío:</strong> ARS$ ${formatearNumero(resultados.totalTarjetaSinImp)}</p>
      </div>
      <h2>Devoluciones Estimadas</h2>
      <div class="refund-details">
        <p><strong>Devolución Estimada en MEP:</strong> ARS$ ${formatearNumero(resultados.refundMEP)}</p>
        <p><strong>Devolución Estimada en Tarjeta:</strong> ARS$ ${formatearNumero(resultados.refundTarjeta)}</p>
        <p class="disclaimer">*Esta devolución aplica solo si ha realizado menos de 5 pedidos internacionales o si el monto total no supera los US$ 3,000 en el año.</p>
      </div>
    </div>`;
    // Asignación del contenido al contenedor
    filaResultados.innerHTML = contenidoHTML;
    const tablaExistente = document.querySelector(".a-lineitem");
    (_a = tablaExistente === null || tablaExistente === void 0 ? void 0 : tablaExistente.parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(filaResultados);
}
