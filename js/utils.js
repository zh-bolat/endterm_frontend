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
