const rangeTrack = document.querySelector(".range-track");
const rangeControls = document.querySelectorAll(".range-control");
let rangeIndex = 0;

function updateRangeCarousel() {
  const firstCard = rangeTrack.querySelector(".range-card");
  const gap = Number.parseFloat(getComputedStyle(rangeTrack).gap);
  const visibleCards = window.innerWidth >= 600 ? 2 : 1;
  const maxIndex = Math.max(0, rangeTrack.children.length - visibleCards);

  rangeIndex = Math.min(rangeIndex, maxIndex);
  rangeTrack.style.transform = `translateX(-${rangeIndex * (firstCard.offsetWidth + gap)}px)`;
  rangeControls[0].disabled = rangeIndex === 0;
  rangeControls[1].disabled = rangeIndex === maxIndex;
}

rangeControls.forEach((control) => {
  control.addEventListener("click", () => {
    rangeIndex += Number(control.dataset.direction);
    updateRangeCarousel();
  });
});

window.addEventListener("resize", updateRangeCarousel);
updateRangeCarousel();

const productList = document.querySelector(".container-card");
const showMoreButton = document.querySelector("#show-more");
const cartCount = document.querySelector("#cart-count");
const productsPerPage = 8;
let products = [];
let visibleProducts = productsPerPage;
let itemsInCart = 0;

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "card-product";

  const imageContainer = document.createElement("div");
  imageContainer.className = "card-image";

  const image = document.createElement("img");
  image.className = "block h-[250px] w-full object-cover";
  image.src = product.image;
  image.alt = product.title;

  const overlay = document.createElement("div");
  overlay.className = "card-overlay";

  const addButton = document.createElement("button");
  addButton.className = "btn-cart";
  addButton.type = "button";
  addButton.textContent = "Add to Cart";

  const content = document.createElement("div");
  content.className = "card-content";

  const title = document.createElement("h2");
  title.textContent = product.title;

  const description = document.createElement("p");
  description.textContent = product.category;

  const price = document.createElement("h3");
  price.textContent = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  overlay.append(addButton);
  content.append(title, description, price);
  imageContainer.append(image, overlay, content);
  card.append(imageContainer);

  return card;
}

function renderProducts() {
  products.slice(0, visibleProducts).forEach((product) => {
    productList.append(createProductCard(product));
  });
  showMoreButton.hidden = visibleProducts >= products.length;
}

showMoreButton.addEventListener("click", () => {
  const previousCount = productList.children.length;
  visibleProducts += productsPerPage;
  products.slice(previousCount, visibleProducts).forEach((product) => {
    productList.append(createProductCard(product));
  });
  showMoreButton.hidden = visibleProducts >= products.length;
});

productList.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest(".btn-cart")) {
    itemsInCart += 1;
    cartCount.textContent = itemsInCart;
  }
});

fetch("https://fakestoreapi.com/products")
  .then((response) => response.json())
  .then((fetchedProducts) => {
    products = fetchedProducts;
    productList.replaceChildren();
    renderProducts();
  });
