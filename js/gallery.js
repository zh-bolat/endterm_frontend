/*
  Forma — Gallery page
  Builds the photo grid from the galleryPhotos array.
*/

const galleryGrid = document.getElementById('gallery-grid');
const galleryFilters = document.getElementById('gallery-filters');
let activeGalleryRoom = 'all';

// Creates one <figure> for a photo; index is used later by the lightbox
function createGalleryItem(photo, index) {
  const figure = document.createElement('figure');
  figure.className = 'gallery-item';
  if (photo.size) {
    figure.classList.add('gallery-item-' + photo.size);
  }

  // The photo is a link to the image file; JavaScript opens it in a lightbox instead
  figure.innerHTML = `
    <a class="gallery-link" href="${photo.image}" aria-label="Open photo: ${photo.title}">
      <img src="${photo.image}" alt="${photo.alt}" loading="lazy">
    </a>
    <figcaption class="image-chip">
      <span class="chip-dot"></span>
      ${photo.title}
      <span class="chip-price">${photo.district}</span>
    </figcaption>`;
  figure.dataset.index = index;
  return figure;
}

// Returns the photos of one room, or all photos for "all"
function getPhotosByRoom(roomValue) {
  if (roomValue === 'all') {
    return galleryPhotos;
  }
  return galleryPhotos.filter(function (photo) {
    return photo.room === roomValue;
  });
}

function renderGallery(list) {
  galleryGrid.innerHTML = '';
  list.forEach(function (photo) {
    galleryGrid.appendChild(createGalleryItem(photo, galleryPhotos.indexOf(photo)));
  });

  // Big tall/wide tiles only make sense in the full grid
  galleryGrid.classList.toggle('is-filtered', list.length !== galleryPhotos.length);
}

// One tab per room that has at least one photo, plus "All rooms"
function renderGalleryTabs() {
  rooms.forEach(function (room) {
    const count = getPhotosByRoom(room.value).length;
    if (count === 0) {
      return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-chip';
    button.dataset.room = room.value;
    button.textContent = room.label + ' (' + count + ')';
    galleryFilters.appendChild(button);
  });
}

function setActiveTab(roomValue) {
  activeGalleryRoom = roomValue;
  for (const button of galleryFilters.children) {
    const isActive = button.dataset.room === roomValue;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  }
}

/* ===== Lightbox =====
   The overlay is created when a photo is opened and removed when it is closed. */
let lightbox = null;
let lightboxPhotos = [];
let lightboxPosition = 0;

function createLightbox() {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Photo viewer');
  overlay.innerHTML = `
    <button class="lightbox-btn lightbox-close" type="button" aria-label="Close">&times;</button>
    <button class="lightbox-btn lightbox-prev" type="button" aria-label="Previous photo">&#8592;</button>
    <figure class="lightbox-figure">
      <img class="lightbox-img" src="" alt="">
      <figcaption class="lightbox-caption"></figcaption>
    </figure>
    <button class="lightbox-btn lightbox-next" type="button" aria-label="Next photo">&#8594;</button>`;
  return overlay;
}

// Shows the photo at the given position of lightboxPhotos (wraps around at the ends)
function showLightboxPhoto(position) {
  const total = lightboxPhotos.length;
  lightboxPosition = (position + total) % total;
  const photo = lightboxPhotos[lightboxPosition];

  const image = lightbox.querySelector('.lightbox-img');
  image.src = photo.image;
  image.alt = photo.alt;
  lightbox.querySelector('.lightbox-caption').textContent =
    photo.title + ' · ' + photo.district + ' — ' + (lightboxPosition + 1) + ' of ' + total;
}

function openLightbox(photo) {
  // Arrows move only through the photos that are visible right now
  lightboxPhotos = getPhotosByRoom(activeGalleryRoom);
  lightbox = createLightbox();
  document.body.appendChild(lightbox);
  document.body.classList.add('no-scroll');
  showLightboxPhoto(lightboxPhotos.indexOf(photo));

  lightbox.addEventListener('click', function (event) {
    const target = event.target;
    if (target.closest('.lightbox-prev')) {
      showLightboxPhoto(lightboxPosition - 1);
    } else if (target.closest('.lightbox-next')) {
      showLightboxPhoto(lightboxPosition + 1);
    } else if (target.closest('.lightbox-close') || target === lightbox) {
      closeLightbox(); // the close button or the dark background
    }
  });

  lightbox.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
  if (!lightbox) {
    return;
  }
  const lastPhoto = lightboxPhotos[lightboxPosition];
  lightbox.remove();
  lightbox = null;
  document.body.classList.remove('no-scroll');

  // Give focus back to the photo that was open
  const index = galleryPhotos.indexOf(lastPhoto);
  const link = galleryGrid.querySelector('[data-index="' + index + '"] .gallery-link');
  if (link) {
    link.focus();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Clicking a photo opens the lightbox instead of following the link
  galleryGrid.addEventListener('click', function (event) {
    const link = event.target.closest('.gallery-link');
    if (!link) {
      return;
    }
    event.preventDefault();
    const index = Number(link.closest('.gallery-item').dataset.index);
    openLightbox(galleryPhotos[index]);
  });

  renderGalleryTabs();
  setActiveTab('all');
  renderGallery(galleryPhotos);

  galleryFilters.addEventListener('click', function (event) {
    const button = event.target.closest('.filter-chip');
    if (!button || button.dataset.room === activeGalleryRoom) {
      return;
    }
    setActiveTab(button.dataset.room);
    renderGallery(getPhotosByRoom(activeGalleryRoom));
  });
});
