"use strict";
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
obtenerValorDolar();
function formatearNumero(numero) {
    return numero.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
async function obtenerValorDolar() {
    try {
        const [respuestaMEP, respuestaTarjeta] = await Promise.all([
            fetch("https://dolarapi.com/v1/dolares/bolsa"),
            fetch("https://dolarapi.com/v1/dolares/tarjeta"),
        ]);
        const datosMEP = await respuestaMEP.json();
        const datosTarjeta = await respuestaTarjeta.json();
        // Obtención de precios desde el HTML
        const { precioProducto, precioEnvio, precioTotal } = obtenerPrecioDesdeHTML();
        // Cálculo de precios estimados
        const { totalMEP, totalTarjeta, refundMEP, refundTarjeta } = calcularPrecioEstimado(precioEnvio, precioProducto, precioTotal, datosMEP.venta, datosTarjeta.venta, datosMEP.compra, datosTarjeta.compra);
        // Mostrar resultados
        mostrarResultado({
            precioEnvio: precioEnvio,
            totalMEPSinImp: totalMEP,
            totalTarjetaSinImp: totalTarjeta,
            precioProducto,
            precioTotalConEnvio: precioTotal,
            refundMEP,
            refundTarjeta,
            valorMEPVenta: datosMEP.venta,
            valorTarjetaVenta: datosTarjeta.venta,
            valorMEPCompra: datosMEP.compra,
            valorTarjetaCompra: datosTarjeta.compra,
        });
    }
    catch (error) {
        console.error("Error al obtener los datos de la API", error);
        alert("Error al obtener los datos de los dólares");
    }
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
    return elemento ? parseFloat(elemento.textContent?.replace(/[^0-9.]/g, "") || "0") : 0;
}
function obtenerPrecioEnvio(elemento) {
    if (elemento) {
        const texto = elemento.textContent?.toLowerCase();
        return texto === "gratis" || texto === "free" ? 0 : parseFloat(elemento.textContent?.replace(/[^0-9.]/g, "") || "0");
    }
    return 0;
}
function obtenerPrecioTotal(elemento) {
    return elemento ? parseFloat(elemento.textContent?.replace(/[^0-9.]/g, "") || "0") : 0;
}
function mostrarResultado(resultados) {
    const filaResultados = document.createElement("section");
    const filaPrecios = document.createElement("section");
    // Cálculo de precios
    const precioBaseProductoMEP = resultados.precioProducto * resultados.valorMEPVenta;
    const precioBaseProductoTarjeta = resultados.precioProducto * resultados.valorTarjetaVenta;
    const precioTotalDolarMep = resultados.precioTotalConEnvio * resultados.valorMEPVenta;
    const precioTotalDolarTarjeta = resultados.precioTotalConEnvio * resultados.valorTarjetaVenta;
    // Construcción del HTML
    const contenidoHTMLDetalles = `
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
    filaResultados.innerHTML = contenidoHTMLDetalles;
    const tablaExistente = document.querySelector(".a-lineitem");
    tablaExistente?.parentElement?.appendChild(filaResultados);
    const precio = document.querySelector(".a-price.aok-align-center");
    const contenidoHTMLPrecio = `<div>
        <p><strong>Total Estimado por Amazon con Envío:</strong> US$ ${formatearNumero(resultados.precioTotalConEnvio)}</p>
        <p><strong>Total Estimado en MEP con Envío:</strong> ARS$ ${formatearNumero(precioTotalDolarMep)}</p>
        <p><strong>Total Estimado en Tarjeta con Envío:</strong> ARS$ ${formatearNumero(precioTotalDolarTarjeta)}</p>
      </div>
      <div>
      <p>Precio dolar tarjeta: 1 USD = ARS$ ${formatearNumero(resultados.valorTarjetaVenta)}</p>
      <p>Precio dolar MEP: 1 USD = ${formatearNumero(resultados.valorMEPVenta)}</p>
      </div>`;
    filaPrecios.innerHTML = contenidoHTMLPrecio;
    precio?.parentElement?.appendChild(filaPrecios);
}
