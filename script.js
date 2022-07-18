const { body } = document;
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
const width = 500;
const height = 700;
const screenWidth = window.screen.width;
const canvasPosition = screenWidth / 2 - width / 2;
const isMobile = window.matchMedia("(max-width: 600px)");
const gameOverEl = document.createElement("div");

const paddleHeight = 10;
const paddleWidth = 50;
const paddleDiff = 25;
let paddleBottomX = 225;
let paddleTopX = 225;
let playerMoved = false;
let paddleContact = false;

let ballX = 250;
let ballY = 350;
const ballRadius = 5;

let speedY;
let speedX;
let trajectoryX;
let computerSpeed;

if (isMobile.matches) {
  speedY = -2;
  speedX = speedY;
  computerSpeed = 4;
} else {
  speedY = -1;
  speedX = speedY;
  computerSpeed = 3;
}

let playerScore = 0;
let computerScore = 0;
const winningScore = 5;
let isGameOver = true;
let isNewGame = true;

function renderCanvas() {
  context.fillStyle = "black";
  context.fillRect(0, 0, width, height);

  context.fillStyle = "white";

  context.fillRect(paddleBottomX, height - 20, paddleWidth, paddleHeight);

  context.fillRect(paddleTopX, 10, paddleWidth, paddleHeight);

  context.beginPath();
  context.setLineDash([4]);
  context.moveTo(0, 350);
  context.lineTo(500, 350);
  context.strokeStyle = "grey";
  context.stroke();

  // ball
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false);
  context.fillStyle = "white";
  context.fill();

  // Scor
  context.font = "32px Courier New";
  context.fillText(playerScore, 20, canvas.height / 2 + 50);
  context.fillText(computerScore, 20, canvas.height / 2 - 30);
}

function createCanvas() {
  canvas.width = width;
  canvas.height = height;
  body.appendChild(canvas);
  renderCanvas();
}

function ballReset() {
  ballX = width / 2;
  ballY = height / 2;
  speedY = -3;
  paddleContact = false;
}

function ballMove() {
  ballY += -speedY;

  if (playerMoved && paddleContact) {
    ballX += speedX;
  }
}

function ballBoundaries() {
  if (ballX < 0 && speedX < 0) {
    speedX = -speedX;
  }

  if (ballX > width && speedX > 0) {
    speedX = -speedX;
  }

  if (ballY > height - paddleDiff) {
    if (ballX > paddleBottomX && ballX < paddleBottomX + paddleWidth) {
      paddleContact = true;

      if (playerMoved) {
        speedY -= 1;

        if (speedY < -5) {
          speedY = -5;
          computerSpeed = 6;
        }
      }
      speedY = -speedY;
      trajectoryX = ballX - (paddleBottomX + paddleDiff);
      speedX = trajectoryX * 0.3;
    } else if (ballY > height) {
      // reseteaza mingea cal.
      ballReset();
      computerScore++;
    }
  }
  // Bounce
  if (ballY < paddleDiff) {
    if (ballX > paddleTopX && ballX < paddleTopX + paddleWidth) {
      // sp
      if (playerMoved) {
        speedY += 1;
        // viteza maxima
        if (speedY > 5) {
          speedY = 5;
        }
      }
      speedY = -speedY;
    } else if (ballY < 0) {
      // reseteaza mingea
      ballReset();
      playerScore++;
    }
  }
}

// A.I calculator movement
function computerAI() {
  if (playerMoved) {
    if (paddleTopX + paddleDiff < ballX) {
      paddleTopX += computerSpeed;
    } else {
      paddleTopX -= computerSpeed;
    }
  }
}

function showGameOverEl(winner) {
  // ascunde canvas
  canvas.hidden = true;
  // container
  gameOverEl.textContent = "";
  gameOverEl.classList.add("game-over-container");
  // titlu
  const title = document.createElement("h1");
  title.textContent = `${winner} Câștigător!`;
  // buton
  const playAgainBtn = document.createElement("button");
  playAgainBtn.setAttribute("onclick", "startGame()");
  playAgainBtn.textContent = "Încearcă din nou";
  // append
  gameOverEl.append(title, playAgainBtn);
  body.appendChild(gameOverEl);
}

// verifica scorul
function gameOver() {
  if (playerScore === winningScore || computerScore === winningScore) {
    isGameOver = true;
    // alege castigatorul
    const winner = playerScore === winningScore ? "Eu" : "Calculator";
    showGameOverEl(winner);
  }
}

// fps
function animate() {
  renderCanvas();
  ballMove();
  ballBoundaries();
  computerAI();
  gameOver();
  if (!isGameOver) {
    window.requestAnimationFrame(animate);
  }
}

// Incepe jocul sau da restart
function startGame() {
  if (isGameOver && !isNewGame) {
    body.removeChild(gameOverEl);
    canvas.hidden = false;
  }
  isGameOver = false;
  isNewGame = false;
  playerScore = 0;
  computerScore = 0;
  ballReset();
  createCanvas();
  animate();
  canvas.addEventListener("mousemove", (e) => {
    playerMoved = true;
    // canvas
    paddleBottomX = e.clientX - canvasPosition - paddleDiff;
    if (paddleBottomX < paddleDiff) {
      paddleBottomX = 0;
    }
    if (paddleBottomX > width - paddleWidth) {
      paddleBottomX = width - paddleWidth;
    }
    // ascunde cursorul
    canvas.style.cursor = "none";
  });
}

// cand se incarca
startGame();
