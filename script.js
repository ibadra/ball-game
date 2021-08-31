const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");
const scoreMarker = document.getElementById("score");
const livesMarker = document.getElementById("lives");

///////////////////VARIABLES//////////////////
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = Math.floor(Math.random() * 5) + 5; //x motion direction
let dy = Math.floor(Math.random() * 5) + 5; // y motion direction
const ballRadius = 15; //Used for collision detection
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightMovement = false; //Right arrow is pressed
let leftMovement = false; //Left arrow is pressed
//Variables for bricks
const brickRowCount = 4;
const brickColumnCount = 6;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 3;
const brickOffsetTop = 15;
const brickOffsetLeft = 15;
//Game variables
let score = 0;
let lives = 3;
//RESTART FUNCTION
function newLife() {
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = Math.floor(Math.random() * 5) + 5; //x motion direction
  dy = Math.floor(Math.random() * 5) + 5; // y motion direction
  paddleX = (canvas.width - paddleWidth) / 2;
}
/////////////////////////////////////////////

///////////////////////EVENT LISTENERS/////////////////////
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("touchstart", touchHandler);
document.addEventListener("touchmove", touchHandler);
//////////////////////////////////////////////////////////

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightMovement = true;
    paddleX += 30;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftMovement = true;
    paddleX -= 30;
    if (paddleX + paddleWidth < paddleWidth) {
      paddleX = 0;
    }
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightMovement = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftMovement = false;
  }
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
  if (paddleX + paddleWidth > canvas.width) {
    paddleX = canvas.width - paddleWidth;
  }
  if (paddleX + paddleWidth < paddleWidth) {
    paddleX = 0;
  }
}

function touchHandler(e) {
  if (e.touches) {
    let relativeX = e.touches[0].pageX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth / 2;
    }
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
    if (paddleX + paddleWidth < paddleWidth) {
      paddleX = 0;
    }
    e.preventDefault();
  }
}

// function touchHandler(e) {
//   if (e.touches) {
//     playerX = e.touches[0].pageX - canvas.offsetLeft - playerWidth / 2;
//     playerY = e.touches[0].pageY - canvas.offsetTop - playerHeight / 2;
//     output.textContent = `Touch:  x: ${playerX}, y: ${playerY}`;
//     e.preventDefault();
//   }
// }

//GAME LOGIC AND FUNCTIONS

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

//BRICKS

//Creating the bricks as a two-dimensional array using a for loop
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

//Drawing the bricks in the canvas
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//Collision detection for the bricks

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          dx = -dx;
          b.status = 0;
          score += 10;
          if (score === brickRowCount * brickColumnCount * 10) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
          scoreMarker.textContent = score;
        }
      }
    }
  }
}

function ballLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawBricks();
  collisionDetection();
  x += dx;
  y += dy;
  //Collision detection for Y axis
  if (y + dy < ballRadius) {
    //Y top
    dy = -dy;
  } else if (y + dy > canvas.height + ballRadius) {
    //Y bottom
    lives--;
    livesMarker.textContent = lives;
    alert("Whoops!");
    newLife();
    if (lives === 0) {
      alert("GAME OVER");
      score = 0;
      lives = 3;
      document.location.reload();
    }
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      //x > paddleX: count from the left border of the paddle all the way to the right side of the canvas
      //x < paddleX + paddleWidth: count from the right side of the paddle
      dy = -dy;
    }
  }
  //Collision detection for X axis
  if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
    dx = -dx;
  }
  requestAnimationFrame(ballLoop);
}
ballLoop();
