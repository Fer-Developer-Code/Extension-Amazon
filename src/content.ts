document.addEventListener("DOMContentLoaded", () => {
    const botonesDetalles = document.querySelectorAll('a.a-popover-trigger.a-declarative span.a-size-base');
    botonesDetalles.forEach((boton) => {
      boton.addEventListener("click", () => obtenerValorDolar());
    });
  });