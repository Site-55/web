// === SITE-55 DYNAMIC BACKGROUND (THEME READY) ===
const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

// === THEMES ===
const themes = {
  default: {
    dotColor: "var(--accent)",
    lineColor: "rgba(var(--accent-rgb),OPACITY)",
    cssVars: {
      "--accent": "#FFD93D",
      "--accent-light": "#FFE066",
      "--accent-rgb": "255,217,61",
      "--text-color": "#F5DAA7",
      "--bg-color": "#000000"
    },
    numDots: 220,
    drift: 0.5,
    extras: false
  },
  halloween: {
    dotColor: "var(--accent)",
    lineColor: "rgba(var(--accent-rgb),OPACITY)",
    cssVars: {
      "--accent": "#FF7518",
      "--accent-light": "#FFA94D",
      "--accent-rgb": "255,117,24",
      "--text-color": "#FFDEB4",
      "--bg-color": "#1a001a"
    },
    numDots: 240,
    drift: 0.4,
    extras: "bats"
  },
  christmas: {
    dotColor: "var(--accent)",
    lineColor: "rgba(var(--accent-rgb),OPACITY)",
    cssVars: {
      "--accent": "#80DFFF",
      "--accent-light": "#B3ECFF",
      "--accent-rgb": "128,223,255",
      "--text-color": "#E6F9FF",
      "--bg-color": "#00111A"
    },
    numDots: 260,
    drift: 0.3,
    extras: "snow"
  }
};

// === SELECT ACTIVE THEME ===
let activeTheme = themes.default;

// Apply CSS variables
function applyThemeColors(theme) {
  Object.entries(theme.cssVars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}
applyThemeColors(activeTheme);

// === CANVAS SETUP ===
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = Math.max(window.innerHeight, document.body.scrollHeight);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// === MOUSE TRACKING ===
const mouse = { x: null, y: null, radius: 150 };
window.addEventListener("mousemove", e => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

// === DOTS, BATS, SNOW ===
let dots = [], bats = [], snowflakes = [];

function createDots() {
  dots = [];
  for (let i = 0; i < activeTheme.numDots; i++) {
    dots.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * activeTheme.drift,
      vy: (Math.random() - 0.5) * activeTheme.drift,
      size: 2
    });
  }
}

function createBats() {
  bats = [];
  if (activeTheme.extras !== "bats") return;
  for (let i = 0; i < 10; i++) {
    bats.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.4,
      speed: 0.8 + Math.random() * 0.6,
      size: 8 + Math.random() * 6,
      flap: Math.random() * Math.PI * 2
    });
  }
}

function createSnow() {
  snowflakes = [];
  if (activeTheme.extras !== "snow") return;
  for (let i = 0; i < 60; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 2,
      vy: 0.3 + Math.random() * 0.6,
      twinkle: Math.random() * 100
    });
  }
}

createDots();
createBats();
createSnow();

// === DRAW FUNCTIONS ===
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawDots(alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  for (let dot of dots) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctx.fillStyle = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent").trim();
    ctx.fill();
  }
  ctx.restore();
}

function connectDots(alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const lineColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent-rgb").trim();

  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.strokeStyle = `rgba(${lineColor},${1 - dist / 120})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.stroke();
      }
    }
    if (mouse.x !== null) {
      const dx = dots[i].x - mouse.x;
      const dy = dots[i].y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        ctx.strokeStyle = `rgba(${lineColor},${1 - dist / mouse.radius})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(dots[i].x, dots[i].y);
        ctx.stroke();
      }
    }
  }
  ctx.restore();
}

function drawBats() {
  bats.forEach(b => {
    b.x += b.speed;
    b.flap += 0.2;
    if (b.x > canvas.width + 20) { b.x = -20; b.y = Math.random() * canvas.height * 0.4; }
    const wingY = Math.sin(b.flap) * 3;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x - b.size, b.y + wingY);
    ctx.lineTo(b.x + b.size, b.y + wingY);
    ctx.closePath();
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fill();
  });
}

function drawSnowflakes() {
  snowflakes.forEach(f => {
    f.y += f.vy;
    f.x += Math.sin(f.y / 20) * 0.5;
    f.twinkle += 0.05;
    if (f.y > canvas.height) { f.y = -5; f.x = Math.random() * canvas.width; }
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    const opacity = 0.5 + Math.sin(f.twinkle) * 0.5;
    ctx.fillStyle = `rgba(255,255,255,${opacity})`;
    ctx.fill();
  });
}

// === ANIMATION LOOP ===
function animate() {
  dots.forEach(dot => {
    dot.x += dot.vx; dot.y += dot.vy;
    if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
    if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
  });

  clearCanvas();
  drawDots();
  connectDots();
  if (activeTheme.extras === "bats") drawBats();
  if (activeTheme.extras === "snow") drawSnowflakes();

  requestAnimationFrame(animate);
}
animate();

// === THEME SWITCH FUNCTION ===
function switchTheme(name) {
  const newTheme = themes[name];
  if (!newTheme) return;
  activeTheme = newTheme;
  createDots(); createBats(); createSnow();
  applyThemeColors(newTheme);
}

// === THEME BUTTON ===

// Dynamically create the button
const themeBtn = document.createElement("button");
themeBtn.id = "theme-btn";
themeBtn.title = "Switch Theme";
themeBtn.style.position = "fixed";
themeBtn.style.right = "1em";
themeBtn.style.background = "none";
themeBtn.style.border = "none";
themeBtn.style.color = "#FFD93D";
themeBtn.style.fontSize = "1.6em";
themeBtn.style.padding = "0.6em 0.8em";
themeBtn.style.borderRadius = "12px";
themeBtn.style.cursor = "pointer";
themeBtn.style.zIndex = 2000;
themeBtn.style.transition = "transform 0.3s ease, color 0.3s ease";
themeBtn.innerHTML = '<i class="fa-solid fa-circle"></i>'; // default icon

document.body.appendChild(themeBtn);

// Get navbar to position below it
const navbar = document.querySelector(".navbar");

// Theme order and icons
const themeOrder = [
  { name: "default", icon: "fa-circle" },
  { name: "halloween", icon: "fa-ghost" },
  { name: "christmas", icon: "fa-snowflake" }
];

// Load saved theme from localStorage
let currentThemeIndex = 0;
const savedTheme = localStorage.getItem("site55Theme");
if (savedTheme) {
  const index = themeOrder.findIndex(t => t.name === savedTheme);
  if (index !== -1) currentThemeIndex = index;
}
switchTheme(themeOrder[currentThemeIndex].name);

// Update button icon and position below navbar
function updateThemeBtn() {
  const icon = themeBtn.querySelector("i");
  icon.className = "fa-solid " + themeOrder[currentThemeIndex].icon;

  const navbarHeight = navbar.offsetHeight;
  themeBtn.style.top = navbarHeight + 10 + "px";
}
updateThemeBtn();
window.addEventListener("resize", updateThemeBtn);

// Button click: cycle theme
themeBtn.addEventListener("click", () => {
  currentThemeIndex = (currentThemeIndex + 1) % themeOrder.length;
  const themeName = themeOrder[currentThemeIndex].name;
  switchTheme(themeName);
  localStorage.setItem("site55Theme", themeName);
  updateThemeBtn();
});

// Optional: hover effect
themeBtn.addEventListener("mouseenter", () => {
  themeBtn.style.transform = "translateY(-3px)";
  themeBtn.style.color = "#FFE066";
});
themeBtn.addEventListener("mouseleave", () => {
  themeBtn.style.transform = "translateY(0)";
  themeBtn.style.color = "#FFD93D";
});