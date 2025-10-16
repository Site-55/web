const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

// Function to resize canvas based on document height
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = document.body.scrollHeight; // cover all content
}

// Initial resize
resizeCanvas();

// Update canvas size on window resize
window.addEventListener("resize", resizeCanvas);

const numDots = 100;
const dots = [];
const mouse = { x: null, y: null, radius: 150 };

// Track mouse position
window.addEventListener("mousemove", e => {
  mouse.x = e.x;
  mouse.y = e.y;
});
window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

// Create random dots
for (let i = 0; i < numDots; i++) {
  dots.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    size: 2
  });
}

// Draw dots
function drawDots() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let dot of dots) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD93D"; 
    ctx.fill();
  }
}

// Connect dots if close enough
function connectDots() {
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.strokeStyle = `rgba(255, 217, 61, ${1 - dist / 120})`;
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
        ctx.strokeStyle = `rgba(255, 217, 61, ${1 - dist / mouse.radius})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(dots[i].x, dots[i].y);
        ctx.stroke();
      }
    }
  }
}

// Animate dots
function animate() {
  for (let dot of dots) {
    dot.x += dot.vx;
    dot.y += dot.vy;

    if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
    if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
  }

  drawDots();
  connectDots();
  requestAnimationFrame(animate);
}

animate();