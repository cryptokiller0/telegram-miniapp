document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".loader").style.display = "none";
  document.querySelector(".app").classList.remove("hidden");
});

const tg = window.Telegram.WebApp;
tg.expand();

const homeScreen = document.getElementById("homeScreen");
const cityScreen = document.getElementById("cityScreen");
const cityTitle = document.getElementById("cityTitle");

function haptic() {
  if (tg.HapticFeedback) {
    tg.HapticFeedback.impactOccurred("medium");
  }
}

function openCity(city) {
  haptic();
  cityTitle.innerText = city;
  homeScreen.classList.remove("active");
  cityScreen.classList.add("active");
}

function goHome() {
  haptic();
  cityScreen.classList.remove("active");
  homeScreen.classList.add("active");
}

function viewAll() {
  haptic();
  alert("Qui mostreremo tutti i prodotti.");
}

function orderNow() {
  haptic();
  window.open("https://t.me/Nelquartiere", "_blank");
}

/* SMOKE EFFECT */
const canvas = document.getElementById("smoke");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: Math.random() * -0.5 - 0.2
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,180,50,0.15)";
    ctx.shadowColor = "#ffae00";
    ctx.shadowBlur = 15;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    p.x += p.speedX;
    p.y += p.speedY;

    if (p.y < 0) {
      p.y = canvas.height;
      p.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();

