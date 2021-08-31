const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

///////////////////VARIABLES//////////////////
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = -6; //x motion direction
let dy = -2; // y motion direction
const ballRadius = 15; //Used for collision detection
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightMovement = false; //Right arrow is pressed
let leftMovement = false; //Left arrow is pressed
//Variables for bricks
const brickRowCount = 6;
const brickColumnCount = 6;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 3;
const brickOffsetTop = 15;
const brickOffsetLeft = 15;
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
    dy = -dy;
  } else if (y + dy > canvas.height + ballRadius + 6) {
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
