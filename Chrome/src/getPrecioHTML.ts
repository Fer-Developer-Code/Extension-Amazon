function getPrecioFromHTMLEspanol(): { productPrice: number; totalPrice: number } {
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
