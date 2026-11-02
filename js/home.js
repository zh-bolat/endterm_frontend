/*
  Forma — Home page
  Shows the featured products from the products array.
*/

// Returns only the products marked as featured
function getFeaturedProducts(list) {
  return list.filter(function (product) {
    return product.featured;
  });
}

function renderFeatured() {
  const container = document.getElementById('featured-list');
  if (!container) {
    return;
  }

  const featured = getFeaturedProducts(products);
  for (const product of featured) {
    container.appendChild(createProductCard(product, 'col-12 col-md-6 col-lg-4'));
  }
}

document.addEventListener('DOMContentLoaded', renderFeatured);
