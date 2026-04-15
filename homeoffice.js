const sortSelect = document.getElementById("sortSelect");
const grid = document.getElementById("productsGrid");

sortSelect.addEventListener("change", () => {

  const products = Array.from(grid.children);

  products.sort((a, b) => {

    const priceA = parseInt(a.dataset.price);
    const priceB = parseInt(b.dataset.price);

    const soldA = parseInt(a.dataset.sold);
    const soldB = parseInt(b.dataset.sold);

    if (sortSelect.value === "low") return priceA - priceB;

    if (sortSelect.value === "high") return priceB - priceA;

    return soldB - soldA;

  });

  grid.innerHTML = "";

  products.forEach(product => grid.appendChild(product));

});