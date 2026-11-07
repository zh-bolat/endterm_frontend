# Forma — Furniture Store Website

Endterm project for the Frontend course. It continues our midterm website for
**Forma**, a fictional minimalist furniture store with a showroom in Astana.

The midterm built five responsive pages with HTML, CSS and Bootstrap. For the
endterm we kept the same topic, team, pages and design and made the site
interactive with JavaScript and jQuery. Every new feature lives on the page where
a visitor needs it. There is no separate demo page.

**Live site:** _add the GitHub Pages link here after publishing_

## Team

| Student | Midterm | Endterm |
|---|---|---|
| ParasatAshk | Project foundation (shared CSS, navbar, footer), Home, About | Shared data and helpers (`data.js`, `utils.js`), theme switcher, favorites counter and panel, back-to-top button, Home featured products, About FAQ accordion |
| bolatov | Catalog, Gallery, Contact | Catalog search, filter, sort, favorites hearts and details, Gallery tabs and lightbox, Contact form validation |

## Technologies

- HTML5, CSS3 (custom properties, Flexbox, CSS Grid, media queries)
- [Bootstrap 5.3.3](https://getbootstrap.com/) from the jsDelivr CDN
- **JavaScript (ES6)** in external files: arrays, loops, functions, DOM manipulation, events, `localStorage`
- **[jQuery 3.7.1](https://jquery.com/)** from the official jQuery CDN: selectors, traversal, events, effects
- Google Fonts: Inter and Instrument Serif
- Photos from [Unsplash](https://unsplash.com/)

## How to run

1. Download or clone the repository.
2. Open `index.html` in any modern browser.

You need an internet connection to load Bootstrap, jQuery and the fonts from their CDNs.
There is no build step: the scripts are plain `.js` files, not modules,
so the site also works when it is opened straight from disk (`file://`).

## Folder structure

```
├── index.html        Home
├── about.html        About
├── catalog.html      Catalog
├── gallery.html      Gallery
├── contact.html      Contact
├── css/
│   └── style.css     shared styles (endterm components and dark theme included)
├── js/
│   ├── theme.js      applies the saved light/dark theme (loaded in <head>)
│   ├── data.js       arrays: products, rooms, galleryPhotos
│   ├── utils.js      reusable helpers: formatPrice, favorites, toast, product card
│   ├── main.js       shared features: theme switcher, favorites panel list, back-to-top
│   ├── effects.js    all jQuery code: panel fades, product details, smooth scroll, FAQ
│   ├── home.js       Home: featured products
│   ├── catalog.js    Catalog: grid, table, search, filter, sort
│   ├── gallery.js    Gallery: photo grid, tabs, lightbox
│   └── contact.js    Contact: booking form validation
├── images/
└── README.md
```

Scripts load at the end of `<body>` in this order: jQuery → Bootstrap →
`data.js` → `utils.js` → `main.js` → `effects.js` → the page's own file.
Each file can use what the files above it define.

## Endterm features

### On every page
- **Theme switcher.** The moon/sun button in the navbar switches between light and dark.
  The choice is saved in `localStorage`. Without a saved choice the site follows the
  operating system setting. `theme.js` runs in `<head>` so a dark page never flashes white.
- **Favorites.** The heart button in the navbar shows how many products are saved.
  Clicking it fades in a panel with the saved products. Each one has a *Remove* button
  that slides the row away. The panel closes with ×, Escape or a click outside it.
- **Back-to-top button.** JavaScript creates it and it appears after you scroll down 600px.
- **Toast messages.** Short notices in the corner, e.g. "Nord sofa saved to favorites".

### Home
- "Loved this season" cards are created from the `products` array (only `featured: true`).
- Room tiles link to the Catalog already filtered by that room (`catalog.html?room=bedroom`).

### About
- FAQ accordion made with jQuery `slideDown` / `slideUp`. Only one answer is open at a time.

### Catalog
- The product grid and the comparison table are built from the `products` array.
- **Search** by name, category or material while typing.
- **Room filter** buttons, generated from the `rooms` array.
- **Sorting:** featured first, price low to high or high to low, name A to Z.
- A results counter, plus an empty-state message with a *Reset filters* button.
- A **heart** on every card saves the product to favorites.
- A **Details** button on every card slides open the material, size, delivery and room.
- "Compare all models ↓" scrolls smoothly to the table (jQuery `animate`).

### Gallery
- Photos are built from the `galleryPhotos` array.
- **Room tabs** filter the photos and show how many photos each room has.
- **Lightbox:** clicking a photo opens it full size. Use ← / → (buttons or keyboard)
  to move and Escape, ×, or a click on the dark background to close.

### Contact
- **Booking form validation** with our own messages under each field (see below).
- A live character counter for the message (turns orange near 500).
- Saved favorites are listed in the form as "Pieces we will prepare for you".
- On success the form is replaced with a confirmation card that shows the booking summary.

## How to test the interactive features

1. **Theme.** Click the moon in the navbar, go to another page (it stays dark), then reload.
2. **Favorites.** In the Catalog, click the heart on two cards. The navbar badge shows 2.
   Open the heart in the navbar, remove one product and watch the card heart update.
3. **Search.** In the Catalog, type `velvet` (2 products), then `zzz` (empty state), then click *Reset filters*.
4. **Filter + sort.** Click *Bedroom*, then *All rooms*, and choose *Price: low to high*.
   The Kai dining chair comes first.
5. **Home → Catalog.** On Home, click the *Dining* tile. The Catalog opens with *Dining* selected.
6. **Details.** Click *Details* on any card to slide the specs open and closed.
7. **FAQ.** On About, open one question, then another. The first one closes.
8. **Gallery.** Click *Bedroom (2)*, open a photo, press → and then Escape.
9. **Form errors.** On Contact, click *Book my visit* with an empty form. Five messages appear and
   the cursor jumps to *Full name*. Then try:
   - name `Aru` → first and last name required
   - email `aru@mail` → incomplete email
   - phone `+7 700 12` → 11 digits required (the phone itself is optional)
   - a past date, or more than 60 days ahead → error
   - guests `9` → only 1–6
   - topic *Custom order* with a short message → at least 20 characters
   - consent not checked → error
10. **Form success.** Fill everything correctly and submit. A confirmation with the date, guests,
    topic and saved pieces replaces the form. *Book another visit* brings back an empty form.
11. **Back to top.** Scroll down any long page and click ↑ in the bottom-left corner.

Open the browser console (F12) while testing. It stays free of errors.

## Requirements coverage (endterm)

| Requirement | Where in the code |
|---|---|
| Arrays (2+, project data) | `js/data.js`: `products`, `rooms`, `galleryPhotos`. Favorites are an array of ids in `localStorage` |
| Loops (2+) | `for` in `renderCompareTable` (catalog.js). `for...of` in `getRoomLabel` (utils.js), `renderFeatured` (home.js), `validateForm` (contact.js). `forEach` in `renderProducts`, `renderGallery`, `renderFavorites` |
| Functions (4+, parameters, return values) | `formatPrice(amount)`, `findProductById(id)`, `toggleFavorite(id)`, `createProductCard(product, columnClass)`, `getFilteredProducts(list, filters)`, `sortProducts(list, sortBy)`, `validateField(field)`, `validateForm(form)`, the `validate*` functions return a message |
| Select and change elements | `getElementById` / `querySelector` everywhere. Text (results count, badge, counter), classes (`is-active`, `is-saved`, `is-invalid`), attributes (`aria-pressed`, `data-theme`), visibility (`hidden`, panel) |
| Content created from an array | product cards (Home, Catalog), table rows, filter buttons, gallery photos, favorites list |
| Add / remove DOM elements | back-to-top button, toasts, lightbox and success card (created and removed), empty state, favorites rows |
| 5+ interface features | search, room filter, sorting, favorites, theme switcher, gallery tabs, lightbox, FAQ accordion, product details, back-to-top |
| `addEventListener`, 3+ event types | `DOMContentLoaded`, `click`, `input`, `change`, `submit`, `blur`, `keydown`, `scroll`, plus the custom `favorites:change` event |
| Event object, `preventDefault()` | form `submit` (contact.js), gallery photo links (gallery.js), in-page anchor links (effects.js). `event.target`, `event.key` |
| Form validation | `js/contact.js`: required fields, email format, name rule, phone length, date range, number range 1–6, option selection, conditional minimum length, checkbox. Messages under each field, submit blocked, success card |
| jQuery included | `<script src="https://code.jquery.com/jquery-3.7.1.min.js">` on every page. All jQuery code is in `js/effects.js` |
| jQuery selectors | ID `#favorites-panel`, class `.site-header`, descendant `#faq .faq-question`, attribute `a[href^="#"]` |
| jQuery traversal | `find()`, `closest()`, `parent()`, `next()`, `siblings()`, `children()` |
| jQuery events | `.on('click')`, `.on('keydown')`, delegated `.on('click', '.details-toggle')` |
| jQuery effects | `fadeIn` / `fadeOut` (favorites panel), `slideDown` / `slideUp` (FAQ, removing a favorite), `slideToggle` (details), `animate` (smooth scroll) |
| External JS, no console errors | nine files in `js/`. The only `<head>` script is `theme.js`, to avoid a white flash |

## Midterm foundation (kept)

- Design tokens as CSS custom properties, pill buttons, headline pills
- Sticky Bootstrap navbar with collapse, shared footer
- CSS Grid (categories, values, gallery), Flexbox (features, stats, info card)
- Semantic HTML, comparison table, positioning, two media-query breakpoints

## Image credits

All photos are from [Unsplash](https://unsplash.com/) and are used under the
[Unsplash License](https://unsplash.com/license).
