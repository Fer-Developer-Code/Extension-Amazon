// Función para agregar separadores de miles
function formatNumber(number: number): string {
    return number.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  