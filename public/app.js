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

for (let i = 0; i < 40; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: canvas.height + Math.random() * 200,
    radius: Math.random() * 3 + 2,
    speed: Math.random() * 0.5 + 0.2
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,120,0,0.05)";
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    p.y -= p.speed;
    if (p.y < 0) {
      p.y = canvas.height;
    }
  });

  requestAnimationFrame(animate);
}

animate();
