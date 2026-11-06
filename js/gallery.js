/*
  Forma — Gallery page
  Builds the photo grid from the galleryPhotos array.
*/

const galleryGrid = document.getElementById('gallery-grid');

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

function renderGallery(list) {
  galleryGrid.innerHTML = '';
  list.forEach(function (photo) {
    galleryGrid.appendChild(createGalleryItem(photo, galleryPhotos.indexOf(photo)));
  });
}

document.addEventListener('DOMContentLoaded', function () {
  renderGallery(galleryPhotos);
});
