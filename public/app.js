const tg = window.Telegram.WebApp;
tg.expand();

const categories = {
  "American Dry": {
    img: "https://picsum.photos/400/300?1",
    products: [
      { name: "Premium A1", img: "https://picsum.photos/400/300?2" },
      { name: "Premium A2", img: "https://picsum.photos/400/300?3" }
    ]
  },
  "Moroccan Static": {
    img: "https://picsum.photos/400/300?4",
    products: [
      { name: "Classic M1", img: "https://picsum.photos/400/300?5" }
    ]
  }
};

const categoriesDiv = document.getElementById("categories");
const productsDiv = document.getElementById("products");
const homeScreen = document.getElementById("homeScreen");
const productsScreen = document.getElementById("productsScreen");

function haptic() {
  if (tg.HapticFeedback) {
    tg.HapticFeedback.impactOccurred("medium");
  }
}

function createCard(title, img, clickAction) {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <img src="${img}">
    <div class="card-title">${title}</div>
  `;
  div.onclick = () => {
    haptic();
    clickAction();
  };
  return div;
}

function showCategories() {
  categoriesDiv.innerHTML = "";
  for (let cat in categories) {
    categoriesDiv.appendChild(
      createCard(cat, categories[cat].img, () => showProducts(cat))
    );
  }
}

function showProducts(category) {
  productsDiv.innerHTML = "";
  categories[category].products.forEach(prod => {
    productsDiv.appendChild(
      createCard(prod.name, prod.img, () => {})
    );
  });

  homeScreen.classList.remove("active");
  productsScreen.classList.add("active");
}

function goHome() {
  haptic();
  productsScreen.classList.remove("active");
  homeScreen.classList.add("active");
}

showCategories();
