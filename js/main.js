/*
  Forma — features shared by every page
  (theme switcher, favorites in the navbar, back-to-top button)
*/

/* ===== Theme switcher ===== */
const THEME_KEY = 'forma-theme';

function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

// Puts the theme on <html>, saves it and updates the button label
function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.setAttribute('data-bs-theme', theme);
  writeStorage(THEME_KEY, theme);

  const button = document.getElementById('theme-toggle');
  if (button) {
    const next = theme === 'dark' ? 'light' : 'dark';
    button.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }
}

function initThemeToggle() {
  const button = document.getElementById('theme-toggle');
  if (!button) {
    return;
  }

  // Sync the label with the theme that js/theme.js already applied
  applyTheme(getCurrentTheme());

  button.addEventListener('click', function () {
    const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    showToast(nextTheme === 'dark' ? 'Dark theme on' : 'Light theme on', 'info');
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initThemeToggle();
});
