/*
  Forma — Catalog page
  Builds the product grid and the comparison table from the products array
  and lets the visitor search, filter by room and sort the products.
*/

const productList = document.getElementById('product-list');
const searchInput = document.getElementById('catalog-search');

// Current state of the toolbar; every control changes one field and re-renders
const filters = {
  search: '',
  room: 'all',
  sort: 'featured'
};

// Returns true when the product name, category or material contains the text
function matchesSearch(product, text) {
  const haystack = (product.name + ' ' + product.category + ' ' + product.material).toLowerCase();
  return haystack.includes(text.trim().toLowerCase());
}

// Returns a new array with only the products that pass every filter
function getFilteredProducts(list, currentFilters) {
  return list.filter(function (product) {
    return matchesSearch(product, currentFilters.search);
  });
}

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

// Applies the filters and redraws the grid
function updateCatalog() {
  renderProducts(getFilteredProducts(products, filters));
}

document.addEventListener('DOMContentLoaded', function () {
  renderCompareTable(products);
  updateCatalog();

  // "input" fires on every key press, so results update while typing
  searchInput.addEventListener('input', function (event) {
    filters.search = event.target.value;
    updateCatalog();
  });
});
