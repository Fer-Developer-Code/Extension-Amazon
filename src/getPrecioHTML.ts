function obtenerPrecioDesdeHTML(): {
  precioProducto: number;
  precioTotal: number;
  precioEnvio: number;
} {
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

function obtenerPrecioProducto(elemento: Element | null): number {
  return elemento ? parseFloat(elemento.textContent?.replace(/[^0-9.]/g, "") || "0") : 0;
}

function obtenerPrecioEnvio(elemento: Element | null): number {
  if (elemento) {
    const texto = elemento.textContent?.toLowerCase();
    return texto === "gratis" || texto === "free" ? 0 : parseFloat(elemento.textContent?.replace(/[^0-9.]/g, "") || "0");
  }
  return 0;
}

function obtenerPrecioTotal(elemento: Element | null): number {
  return elemento ? parseFloat(elemento.textContent?.replace(/[^0-9.]/g, "") || "0") : 0;
}
