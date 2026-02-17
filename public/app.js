const tg = window.Telegram?.WebApp;
if (tg) {
  fetch("/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      initData: tg.initData
    })
  }).then(res => {
    if (!res.ok) {
      document.body.innerHTML = "<h1>Accesso negato</h1>";
    }
  });
}


if (tg) {
  tg.expand();
}

const intro = document.getElementById("intro");
const mainApp = document.getElementById("mainApp");
const homeScreen = document.getElementById("homeScreen");
const cityScreen = document.getElementById("cityScreen");
const cityTitle = document.getElementById("cityTitle");
const productsGrid = document.getElementById("productsGrid");

window.addEventListener("load", () => {

  if (tg) {
    tg.HapticFeedback.impactOccurred("medium");
  }

  setTimeout(() => {
    intro.style.opacity = "0";
    intro.style.transition = "1s ease";

    setTimeout(() => {
      intro.remove();
      mainApp.style.display = "block";

    }, 1000);

  }, 3700);
});

function openCity(city) {
  cityTitle.innerText = city;
  homeScreen.classList.remove("active");
  cityScreen.classList.add("active");
  window.scrollTo(0, 0);

  if (city === "ROMA") {
    renderRomaCategories();
  } else {
    renderProducts(city);
  }
}

function renderRomaCategories() {

  productsGrid.innerHTML = "";

  const categories = [
    { name: "MAROCCAN HASH", img: "assets/ROMA/maroccanhash.jpg" },
    { name: "WEED", img: "assets/ROMA/weed.jpg" },
    { name: "HASH USA", img: "assets/ROMA/hashusa.jpg" },
    { name: "ICE & EXTRACTION", img: "assets/ROMA/Ice&extraction.jpg" }, 
    { name: "VAPE PEN", img: "assets/ROMA/vapepen.jpg" }
  ];

  categories.forEach((cat, index) => {

    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${index * 0.15}s`;

    card.innerHTML = `
      <img src="${cat.img}">
      <div class="card-overlay"></div>
      <div class="card-title">${cat.name}</div>
    `;

    card.onclick = () => {
      alert("Apriremo la categoria: " + cat.name);
    };

    productsGrid.appendChild(card);
  });

  if (tg) {
    tg.HapticFeedback.selectionChanged();
  }
}

function goHome() {
  cityScreen.classList.remove("active");
  homeScreen.classList.add("active");
  window.scrollTo(0, 0);
}

function viewAll() {
  alert("Sezione prodotti completa in arrivo.");
}

function orderNow() {
  window.open("https://t.me/Nelquartiere", "_blank");
}
