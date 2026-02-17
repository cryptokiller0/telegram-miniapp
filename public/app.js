/* FLAME INTRO */
const flameCanvas = document.getElementById("flameCanvas");
const flameCtx = flameCanvas.getContext("2d");

flameCanvas.width = window.innerWidth;
flameCanvas.height = window.innerHeight;

let flames = [];

for (let i = 0; i < 120; i++) {
  flames.push({
    x: Math.random() * flameCanvas.width,
    y: flameCanvas.height,
    size: Math.random() * 3 + 2,
    speed: Math.random() * 3 + 2
  });
}

function animateFlames() {
  flameCtx.clearRect(0, 0, flameCanvas.width, flameCanvas.height);

  flames.forEach(f => {
    flameCtx.beginPath();
    let gradient = flameCtx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 5);
    gradient.addColorStop(0, "rgba(255,180,0,0.9)");
    gradient.addColorStop(0.4, "rgba(255,80,0,0.6)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    flameCtx.fillStyle = gradient;
    flameCtx.arc(f.x, f.y, f.size * 5, 0, Math.PI * 2);
    flameCtx.fill();

    f.y -= f.speed;

    if (f.y < 0) {
      f.y = flameCanvas.height;
      f.x = Math.random() * flameCanvas.width;
    }
  });

  requestAnimationFrame(animateFlames);
}

animateFlames();

document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector(".app");
  if (app) {
    app.classList.remove("hidden");
  }
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

  const overlay = document.createElement("div");
  overlay.className = "transition-flame";
  document.body.appendChild(overlay);

  setTimeout(() => {
    homeScreen.classList.remove("active");
    cityScreen.classList.add("active");
  }, 300);

  setTimeout(() => {
    overlay.remove();
  }, 900);
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

