/*
  Forma — Catalog page
  Builds the product grid and the comparison table from the products array.
*/

const productList = document.getElementById('product-list');

// Draws the given products as cards (the old cards are removed first)
function renderProducts(list) {
  productList.innerHTML = '';
  list.forEach(function (product) {
    productList.appendChild(createProductCard(product, 'col-12 col-sm-6 col-lg-4'));
  });
}

document.addEventListener('DOMContentLoaded', function () {
  renderProducts(products);
});
