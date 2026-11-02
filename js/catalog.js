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

// Fills the comparison table: one <tr> per product
function renderCompareTable(list) {
  const body = document.getElementById('compare-body');
  body.innerHTML = '';

  for (let i = 0; i < list.length; i++) {
    const product = list[i];
    const row = document.createElement('tr');
    row.dataset.id = product.id;
    row.innerHTML = `
      <th scope="row">${product.name}</th>
      <td>${product.category}</td>
      <td>${product.material}</td>
      <td>${product.size}</td>
      <td>${product.deliveryDays} days</td>
      <td class="price text-end">${formatPrice(product.price)}</td>`;
    body.appendChild(row);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  renderProducts(products);
  renderCompareTable(products);
});
