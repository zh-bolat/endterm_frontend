/*
  Forma — applies the saved color theme
  This small file is loaded in <head> (not at the end of <body>) on purpose:
  it sets data-theme before the page is drawn, so a dark-theme visitor
  never sees a white flash while the page loads.
*/
(function () {
  let theme = null;

  try {
    theme = JSON.parse(localStorage.getItem('forma-theme'));
  } catch (error) {
    theme = null;
  }

  // No saved choice yet: follow the operating system setting
  if (theme !== 'light' && theme !== 'dark') {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? 'dark' : 'light';
  }

  // data-theme is used by our CSS, data-bs-theme switches Bootstrap's own colors
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-bs-theme', theme);
})();
