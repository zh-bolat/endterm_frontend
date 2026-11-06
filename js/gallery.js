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

  figure.innerHTML = `
    <img src="${photo.image}" alt="${photo.alt}" loading="lazy">
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

document.addEventListener('DOMContentLoaded', function () {
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
