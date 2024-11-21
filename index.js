

const productGrid = document.getElementById('productGrid');
const loadMoreButton = document.getElementById('loadMoreButton');
const searchBar = document.getElementById('searchBar');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const sortBy = document.getElementById('sortBy');

let products = [];
let displayedProducts = 0;

// Fetch products from API
async function fetchProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    products = await response.json();
    populateFilters();
    displayProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Display products
function displayProducts(processedProducts) {
  const startIndex = displayedProducts;
  const endIndex = startIndex + 10;
  const productsToDisplay = processedProducts?.length ? processedProducts :  products.slice(startIndex, endIndex);
  processedProducts?.length && (productGrid.innerHTML ='');
  productsToDisplay.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
      <li tabindex="0">
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p class="price">$${product.price}</p>
      </li>
    `;
    productGrid.appendChild(productCard);
  });

  displayedProducts += productsToDisplay.length;

  if (displayedProducts >= products.length) {
    loadMoreButton.style.display = 'none';
  }
}

// Load more products
loadMoreButton.addEventListener('click', displayProducts);

// Filter and sort logic
function applyFilters() {
 // debugger;
  let filteredProducts = products;

  // Apply category filter
  if (categoryFilter.value) {
    filteredProducts = filteredProducts.filter(product => product.category === categoryFilter.value);
  }

  // Apply price filter
  if (priceFilter.value) {
    const [minPrice, maxPrice] = priceFilter.value.split('-').map(Number);
    filteredProducts = filteredProducts.filter(product => product.price >= minPrice && product.price <= maxPrice);
  }

  // Apply sorting
  if (sortBy.value === 'priceAsc') {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'priceDesc') {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }
  displayProducts(filteredProducts);
 // return filteredProducts;
}

// Populate filter options dynamically
function populateFilters() {
  const categories = [...new Set(products.map(product => product.category))];
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.innerText = category;
    categoryFilter.appendChild(option);
  });

  // Price range options (example ranges)
  const priceRanges = ['0-50', '50-100', '100-200'];
  priceRanges.forEach(range => {
    const option = document.createElement('option');
    option.value = range;
    option.innerText = `$${range.replace('-', ' - $')}`;
    priceFilter.appendChild(option);
  });
}

// Event listeners for filters
searchBar.addEventListener('input', () => {
  const query = searchBar.value.toLowerCase();
  let filteredProd = products.filter(product => product.title.toLowerCase().includes(query));
  displayedProducts = 0;
  productGrid.innerHTML = '';
  displayProducts(filteredProd);
});

categoryFilter.addEventListener('change', applyFilters);
priceFilter.addEventListener('change', applyFilters);
sortBy.addEventListener('change', applyFilters);

// Initialize the page
fetchProducts();
