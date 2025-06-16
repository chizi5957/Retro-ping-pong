const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

// Ball and paddle setup
let ball = { x: canvas.width / 2, y: canvas.height - 30, radius: 8 };
let dx = isMobile ? 1 : 1;
let dy = isMobile ? -1 : -1;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

let score = 0;
let bestScore = 0;
let level = 1;

const colors = ["#002652", "#2D1E7B", "#36071E", "#460101", "#073624", "#0A4552"];
let currentColorIndex = 0;

// Event Listeners
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.getElementById("playAgainBtn").addEventListener("click", resetGame);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}
function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = "12px 'Press Start 2P'";
  ctx.fillText("Score: " + score, 8, 20);
  ctx.fillText("Best: " + bestScore, canvas.width - 110, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();

  // Ball movement
  ball.x += dx;
  ball.y += dy;

  // Wall collision
  if (ball.x + dx > canvas.width - ball.radius || ball.x + dx < ball.radius) dx = -dx;
  if (ball.y + dy < ball.radius) dy = -dy;
  else if (ball.y + dy > canvas.height - ball.radius) {
    if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
      dy = -dy;
      score++;
      if (score % 5 === 0) {
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        document.body.style.backgroundColor = colors[currentColorIndex];
        level++;
        document.getElementById("level").textContent = "Level: " + level;
      }
    } else {
      gameOver();
      return;
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
  else if (leftPressed && paddleX > 0) paddleX -= 5;

  requestAnimationFrame(draw);
}

function gameOver() {
  document.getElementById("finalScore").textContent = "Your Score: " + score;
  if (score > bestScore) {
    bestScore = score;
    document.getElementById("bestScoreText").textContent = "New Best Score: " + bestScore;
  } else {
    document.getElementById("bestScoreText").textContent = "Best Score: " + bestScore;
  }
  document.getElementById("gameOverScreen").classList.remove("hidden");
}

function resetGame() {
  ball = { x: canvas.width / 2, y: canvas.height - 30, radius: 8 };
  dx = isMobile ? 1 : 1;
  dy = isMobile ? -1 : -1;
  paddleX = (canvas.width - paddleWidth) / 2;
  score = 0;
  level = 1;
  document.getElementById("level").textContent = "Level: 1";
  document.body.style.backgroundColor = colors[0];
  document.getElementById("gameOverScreen").classList.add("hidden");
  draw();
}

resetGame(); // Start game
