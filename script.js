
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const paddleWidth = 80;
const paddleHeight = 12;
let paddleX = canvas.width / 2 - paddleWidth / 2;
let rightPressed = false;
let leftPressed = false;
let isTouching = false;
let touchStartX = 0;
let score = 0;
let bestScore = 0;
let level = 1;
let ballSpeed = 3;
const maxTrail = 8;
let trail = [];
const bgColors = ["#002652", "#2D1E7B", "#36071E", "#460101", "#073624", "#0A4552"];
let currentColorIndex = 0;
const ball = { x: canvas.width / 2, y: canvas.height - 30, radius: 12, dx: 2, dy: -3 };

document.addEventListener("keydown", (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});

canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  if (touch.clientY > canvas.getBoundingClientRect().bottom - 60) {
    isTouching = true;
    touchStartX = touch.clientX;
  }
});
canvas.addEventListener("touchmove", (e) => {
  if (!isTouching) return;
  const touch = e.touches[0];
  const deltaX = touch.clientX - touchStartX;
  paddleX += deltaX;
  touchStartX = touch.clientX;
});
canvas.addEventListener("touchend", () => isTouching = false);

function drawPaddle() {
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillRect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
}

function drawBall() {
  ctx.beginPath();
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px serif";
  ctx.fillText("⚽", ball.x - ball.radius, ball.y + ball.radius / 2);
  ctx.closePath();
}

function drawTrail() {
  for (let i = 0; i < trail.length; i++) {
    ctx.beginPath();
    ctx.globalAlpha = (i + 1) / trail.length / 2;
    ctx.fillText("⚽", trail[i].x - ball.radius, trail[i].y + ball.radius / 2);
    ctx.closePath();
  }
  ctx.globalAlpha = 1.0;
}

function drawScore() {
  ctx.font = "14px 'Press Start 2P'";
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("Best: " + bestScore, canvas.width - 150, 20);
}

function drawLevel() {
  document.getElementById("level").textContent = "Level: " + level;
}

function update() {
  ctx.fillStyle = bgColors[currentColorIndex];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawLevel();
  drawScore();
  drawPaddle();
  drawTrail();
  drawBall();

  ball.x += ball.dx * ballSpeed;
  ball.y += ball.dy * ballSpeed;

  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
  else if (leftPressed && paddleX > 0) paddleX -= 7;

  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx = -ball.dx;
  if (ball.y - ball.radius < 0) ball.dy = -ball.dy;

  if (
    ball.y + ball.radius >= canvas.height - paddleHeight - 10 &&
    ball.x > paddleX &&
    ball.x < paddleX + paddleWidth &&
    ball.dy > 0
  ) {
    ball.dy = -ball.dy;
    score++;
    if (score % 5 === 0) {
      level++;
      ballSpeed += 0.5;
      currentColorIndex = (currentColorIndex + 1) % bgColors.length;
    }
  } else if (ball.y + ball.radius > canvas.height) {
    if (score > bestScore) {
      bestScore = score;
      document.getElementById("bestScoreText").innerText = "New Best: " + bestScore;
    } else {
      document.getElementById("bestScoreText").innerText = "Best Score: " + bestScore;
    }
    document.getElementById("finalScoreText").innerText = "Your Score: " + score;
    document.getElementById("gameOverScreen").style.display = "block";
    return;
  }

  trail.push({ x: ball.x, y: ball.y });
  if (trail.length > maxTrail) trail.shift();
  requestAnimationFrame(update);
}

document.getElementById("playAgainBtn").addEventListener("click", () => {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 30;
  ball.dx = 2;
  ball.dy = -3;
  ballSpeed = 3;
  paddleX = canvas.width / 2 - paddleWidth / 2;
  score = 0;
  level = 1;
  currentColorIndex = 0;
  document.getElementById("gameOverScreen").style.display = "none";
  update();
});

update();
