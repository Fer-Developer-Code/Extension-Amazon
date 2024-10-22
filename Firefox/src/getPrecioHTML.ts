function getPrecioFromHTML(): { productPrice: number; totalPrice: number } {
  const priceElement = document.querySelector(".a-price .a-offscreen");
  const totalPriceElement = document.querySelector(
    "table.a-lineitem tbody tr:last-child td:nth-child(3) span"
  );

  const productPrice = priceElement
    ? parseFloat(priceElement.textContent?.replace(/[^0-9.]/g, "") || "0")
    : 0;

  const totalPrice = totalPriceElement
    ? parseFloat(totalPriceElement.textContent?.replace(/[^0-9.]/g, "") || "0")
    : 0;

  return { productPrice, totalPrice };
}
