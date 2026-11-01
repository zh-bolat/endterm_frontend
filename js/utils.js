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
