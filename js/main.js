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

document.addEventListener('DOMContentLoaded', function () {
  initThemeToggle();
});
