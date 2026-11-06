/*
  Forma — Catalog page
  Builds the product grid and the comparison table from the products array
  and lets the visitor search, filter by room and sort the products.
*/

const productList = document.getElementById('product-list');
const searchInput = document.getElementById('catalog-search');
const roomFilters = document.getElementById('room-filters');
const sortSelect = document.getElementById('catalog-sort');
const resultsCount = document.getElementById('results-count');

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

// Returns a sorted copy of the list; the original array is not changed
function sortProducts(list, sortBy) {
  const sorted = list.slice();

  if (sortBy === 'price-asc') {
    sorted.sort(function (a, b) { return a.price - b.price; });
  } else if (sortBy === 'price-desc') {
    sorted.sort(function (a, b) { return b.price - a.price; });
  } else if (sortBy === 'name') {
    sorted.sort(function (a, b) { return a.name.localeCompare(b.name); });
  } else {
    // "featured": featured products first, the rest keep their order
    sorted.sort(function (a, b) { return Number(b.featured) - Number(a.featured); });
  }

  return sorted;
}

// Returns a new array with only the products that pass every filter, sorted
function getFilteredProducts(list, currentFilters) {
  const filtered = list.filter(function (product) {
    const roomMatches = currentFilters.room === 'all' || product.room === currentFilters.room;
    return roomMatches && matchesSearch(product, currentFilters.search);
  });
  return sortProducts(filtered, currentFilters.sort);
}

// Creates one filter button per room from the rooms array
function renderRoomFilters() {
  rooms.forEach(function (room) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-chip';
    button.textContent = room.label;
    button.dataset.room = room.value;
    roomFilters.appendChild(button);
  });
}

// Highlights the active room button
function setActiveRoom(roomValue) {
  const buttons = roomFilters.querySelectorAll('.filter-chip');
  for (const button of buttons) {
    const isActive = button.dataset.room === roomValue;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  }
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

// "1 product" / "3 products"
function pluralize(count, word) {
  return count + ' ' + word + (count === 1 ? '' : 's');
}

// Message with a reset button, added to the grid when nothing matches
function createEmptyState() {
  const empty = document.createElement('div');
  empty.className = 'col-12 empty-state';
  empty.innerHTML = `
    <p class="empty-title">No products match your search.</p>
    <p>Try another word or show every room again.</p>
    <button class="btn btn-soft btn-small" type="button" id="reset-filters">Reset filters</button>`;
  return empty;
}

// Reads ?room=bedroom from the address (used by the category tiles on Home).
// Returns "all" when the value is missing or unknown.
function getRoomFromUrl() {
  const value = new URLSearchParams(window.location.search).get('room');
  const isKnownRoom = rooms.some(function (room) {
    return room.value === value;
  });
  return isKnownRoom ? value : 'all';
}

// Puts every control back to its starting value
function resetFilters() {
  filters.search = '';
  filters.room = 'all';
  filters.sort = 'featured';
  searchInput.value = '';
  sortSelect.value = 'featured';
  setActiveRoom('all');
  updateCatalog();
  searchInput.focus();
}

// Applies the filters, redraws the grid and updates the counter text
function updateCatalog() {
  const visible = getFilteredProducts(products, filters);
  renderProducts(visible);

  if (visible.length === 0) {
    productList.appendChild(createEmptyState());
  }

  let text = 'Showing ' + pluralize(visible.length, 'product');
  if (filters.room !== 'all') {
    text += ' for ' + getRoomLabel(filters.room).toLowerCase();
  }
  resultsCount.textContent = text + '.';
}

document.addEventListener('DOMContentLoaded', function () {
  filters.room = getRoomFromUrl();
  renderRoomFilters();
  setActiveRoom(filters.room);
  renderCompareTable(products);
  updateCatalog();

  // The reset button is created later, so the click is caught on the grid
  productList.addEventListener('click', function (event) {
    if (event.target.id === 'reset-filters') {
      resetFilters();
    }
  });

  // "change" fires once a new option is chosen
  sortSelect.addEventListener('change', function (event) {
    filters.sort = event.target.value;
    updateCatalog();
  });

  // One listener on the group handles every room button (event delegation)
  roomFilters.addEventListener('click', function (event) {
    const button = event.target.closest('.filter-chip');
    if (!button) {
      return;
    }
    filters.room = button.dataset.room;
    setActiveRoom(filters.room);
    updateCatalog();
  });

  // "input" fires on every key press, so results update while typing
  searchInput.addEventListener('input', function (event) {
    filters.search = event.target.value;
    updateCatalog();
  });
});
