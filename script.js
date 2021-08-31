const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

///////////////////VARIABLES//////////////////
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = -6; //x motion direction
let dy = -2; // y motion direction
const ballRadius = 20; //Used for collision detection
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightMovement = false; //Right arrow is pressed
let leftMovement = false; //Left arrow is pressed
//Variables for bricks
const brickRow = 3;
const brickColumn = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
/////////////////////////////////////////////

///////////////////////EVENT LISTENERS/////////////////////
document.addEventListener("keydown", keyDownHandler, false);
// document.addEventListener("touchmove", swipeHandler, false);
// document.addEventListener("touchend", stopSwipeHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
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

function swipeHandler(e) {
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

// function swipeHandler(e) {
//   if (e.touches[0].clientX > 0) {
//     rightMovement = true;
//     paddleX += 10;
//     if (paddleX + paddleWidth > canvas.width) {
//       paddleX = canvas.width - paddleWidth;
//     }
//   } else if (e.touches[0].clientX < 0) {
//     leftMovement = true;
//     paddleX -= 10;
//     if (paddleX + paddleWidth < paddleWidth) {
//       paddleX = 0;
//     }
//   }
// }

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

function ballLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  x += dx;
  y += dy;
  //Collision detection for Y axis
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height + 2 * ballRadius) {
    alert("Game Over");
    document.location.reload();
    clearInterval(interval);
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
}
let interval = setInterval(ballLoop, 20);
