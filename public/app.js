const tg = window.Telegram?.WebApp;

if (tg) {
  tg.expand();
}

const intro = document.getElementById("intro");
const mainApp = document.getElementById("mainApp");
const homeScreen = document.getElementById("homeScreen");
const cityScreen = document.getElementById("cityScreen");
const cityTitle = document.getElementById("cityTitle");

window.addEventListener("load", () => {

  if (tg) {
    tg.HapticFeedback.impactOccurred("medium");
  }

  setTimeout(() => {
    intro.style.opacity = "0";
    intro.style.transition = "1s ease";

    setTimeout(() => {
      intro.remove();
      mainApp.classList.remove("hidden");
    }, 1000);

  }, 3800);
});

function openCity(city) {
  cityTitle.innerText = city;
  homeScreen.classList.remove("active");
  cityScreen.classList.add("active");
  window.scrollTo(0, 0);

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
