/*
  Forma — reusable helper functions
  Used by every page, so this file is loaded right after data.js.
*/

// Turns 1490 into "$1,490"
function formatPrice(amount) {
  return '$' + amount.toLocaleString('en-US');
}

// Finds one product in the products array by its id (or returns undefined)
function findProductById(id) {
  return products.find(function (product) {
    return product.id === id;
  });
}

// Returns the label of a room value, e.g. "living" → "Living"
function getRoomLabel(value) {
  for (const room of rooms) {
    if (room.value === value) {
      return room.label;
    }
  }
  return value;
}

/* ===== localStorage helpers =====
   localStorage can be disabled (private mode, blocked cookies),
   so every read and write is wrapped in try...catch. */
function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Nothing to do: the page still works, it just will not remember the value
  }
}

/* ===== Favorites — saved product ids in localStorage ===== */
const FAVORITES_KEY = 'forma-favorites';

function getFavorites() {
  return readStorage(FAVORITES_KEY, []);
}

function isFavorite(productId) {
  return getFavorites().includes(productId);
}

// Adds the product if it is not saved yet, removes it otherwise.
// Returns true when the product is a favorite after the call.
function toggleFavorite(productId) {
  let favorites = getFavorites();
  const wasSaved = favorites.includes(productId);

  if (wasSaved) {
    favorites = favorites.filter(function (id) {
      return id !== productId;
    });
  } else {
    favorites.push(productId);
  }

  writeStorage(FAVORITES_KEY, favorites);

  // Tell every part of the page (navbar counter, panel, cards) that favorites changed
  document.dispatchEvent(new CustomEvent('favorites:change'));
  return !wasSaved;
}

/* ===== Toast — short message in the corner of the screen =====
   type is "success" (default) or "info". The toast removes itself. */
function showToast(message, type) {
  let stack = document.querySelector('.toast-stack');

  // The container is created only once, the first time a toast is shown
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    stack.setAttribute('aria-live', 'polite');
    document.body.appendChild(stack);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-message toast-' + (type || 'success');
  toast.textContent = message;
  stack.appendChild(toast);

  setTimeout(function () {
    toast.classList.add('is-hiding');
  }, 2600);

  setTimeout(function () {
    toast.remove();
  }, 3000);
}

/* ===== Product card =====
   Returns a Bootstrap column with one product card inside.
   columnClass lets each page choose its own grid, e.g. "col-12 col-md-6 col-lg-4". */
function createProductCard(product, columnClass) {
  const column = document.createElement('div');
  column.className = columnClass;

  // Tag in the corner only for products that have one ("New", "Bestseller")
  let tagHtml = '';
  if (product.tag) {
    const tagClass = product.tag === 'New' ? 'product-tag product-tag-new' : 'product-tag';
    tagHtml = `<span class="${tagClass}">${product.tag}</span>`;
  }

  const saved = isFavorite(product.id);

  column.innerHTML = `
    <article class="product-card" data-id="${product.id}">
      ${tagHtml}
      <button class="favorite-btn${saved ? ' is-saved' : ''}" type="button" aria-pressed="${saved}" aria-label="Save ${product.name} to favorites">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.3C1.5 7.9 3.6 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.4 0 5.5 3.4 4.3 6.7-1.8 4.7-9.3 9.3-9.3 9.3z"/></svg>
      </button>
      <img class="product-card-img" src="${product.image}" alt="${product.alt}" loading="lazy">
      <div class="product-card-body">
        <div class="d-flex justify-content-between align-items-baseline gap-3">
          <h3 class="product-card-title">${product.name}</h3>
          <span class="price">${formatPrice(product.price)}</span>
        </div>
        <p class="product-card-text">${product.description}</p>
      </div>
    </article>`;

  return column;
}
