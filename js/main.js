/*
  Forma — features shared by every page
  (theme switcher, favorites in the navbar, back-to-top button)
*/

/* ===== Theme switcher ===== */
const THEME_KEY = 'forma-theme';

function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

// The button label always names the theme a click will switch to
function updateThemeButton(theme) {
  const button = document.getElementById('theme-toggle');
  if (button) {
    const next = theme === 'dark' ? 'light' : 'dark';
    button.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }
}

// Puts the theme on <html>, saves the visitor's choice and updates the button
function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.setAttribute('data-bs-theme', theme);
  writeStorage(THEME_KEY, theme);
  updateThemeButton(theme);
}

function initThemeToggle() {
  const button = document.getElementById('theme-toggle');
  if (!button) {
    return;
  }

  // Sync the label with the theme that js/theme.js already applied.
  // Nothing is saved here, so the OS setting is followed until the visitor clicks.
  updateThemeButton(getCurrentTheme());

  button.addEventListener('click', function () {
    const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    showToast(nextTheme === 'dark' ? 'Dark theme on' : 'Light theme on', 'info');
  });
}

/* ===== Favorites counter and panel list ===== */

// Builds one <li> of the favorites panel for a product
function createFavoriteItem(product) {
  const item = document.createElement('li');
  item.className = 'favorite-item';
  item.dataset.id = product.id;

  const image = document.createElement('img');
  image.src = product.image;
  image.alt = '';

  const info = document.createElement('div');
  info.className = 'favorite-info';
  info.innerHTML = '<span class="favorite-name"></span><span class="favorite-price"></span>';
  info.querySelector('.favorite-name').textContent = product.name;
  info.querySelector('.favorite-price').textContent = formatPrice(product.price);

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'favorite-remove';
  remove.textContent = 'Remove';
  remove.setAttribute('aria-label', 'Remove ' + product.name + ' from favorites');

  item.append(image, info, remove);
  return item;
}

// Redraws the navbar badge and the panel list from localStorage
function renderFavorites() {
  const favoriteIds = getFavorites();
  const count = document.getElementById('favorites-count');
  const list = document.getElementById('favorites-list');
  const empty = document.getElementById('favorites-empty');

  if (count) {
    count.textContent = favoriteIds.length;
    count.classList.toggle('is-empty', favoriteIds.length === 0);
  }

  if (!list) {
    return;
  }

  list.innerHTML = '';
  favoriteIds.forEach(function (id) {
    const product = findProductById(id);
    if (product) {
      list.appendChild(createFavoriteItem(product));
    }
  });

  // The hint is shown only while nothing is saved
  empty.style.display = favoriteIds.length === 0 ? 'block' : 'none';
}

// Short pop animation on the badge after a change
function bumpFavoritesCount() {
  const count = document.getElementById('favorites-count');
  if (!count) {
    return;
  }
  count.classList.remove('is-bumped');
  void count.offsetWidth; // restart the CSS animation
  count.classList.add('is-bumped');
}

/* ===== Back-to-top button =====
   The button is not in the HTML: it is created here and added to <body>. */
function initBackToTop() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'back-to-top';
  button.setAttribute('aria-label', 'Back to top');
  button.innerHTML = '<span aria-hidden="true">↑</span>';
  document.body.appendChild(button);

  // Show the button only after the visitor has scrolled down a bit
  window.addEventListener('scroll', function () {
    button.classList.toggle('is-visible', window.scrollY > 600);
  });

  button.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== Heart buttons on product cards (Home and Catalog) ===== */

// Makes every heart on the page match the saved favorites
function syncFavoriteButtons() {
  document.querySelectorAll('.product-card').forEach(function (card) {
    const button = card.querySelector('.favorite-btn');
    const saved = isFavorite(card.dataset.id);
    button.classList.toggle('is-saved', saved);
    button.setAttribute('aria-pressed', String(saved));
  });
}

function initFavoriteButtons() {
  // Cards are created by JavaScript, so one listener on the document catches every heart
  document.addEventListener('click', function (event) {
    const button = event.target.closest('.favorite-btn');
    if (!button) {
      return;
    }

    const card = button.closest('.product-card');
    const product = findProductById(card.dataset.id);
    const saved = toggleFavorite(product.id);

    showToast(saved ? product.name + ' saved to favorites' : product.name + ' removed from favorites', saved ? 'success' : 'info');
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initThemeToggle();
  initFavoriteButtons();
  initBackToTop();
  renderFavorites();

  // toggleFavorite() in utils.js fires this event after every change
  document.addEventListener('favorites:change', function () {
    renderFavorites();
    syncFavoriteButtons();
    bumpFavoritesCount();
  });
});
