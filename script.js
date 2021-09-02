const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");
const scoreMarker = document.getElementById("score");
const livesMarker = document.getElementById("lives");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const images = [
  "url('img/1.png')",
  "url('img/2.png')",
  "url('img/3.png')",
  "url('img/4.png')",
  "url('img/6.png')",
];

canvas.style.backgroundImage = images[Math.floor(Math.random() * 4)]; //Sets random background image

///////////////////VARIABLES//////////////////
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = Math.floor(Math.random() * 3) + 4; //x motion direction
var dy = Math.floor(Math.random() * 3) + 4; // y motion direction
const ballRadius = 15; //Used for collision detection
const paddleHeight = 10;
const paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightMovement = false; //Right arrow is pressed
var leftMovement = false; //Left arrow is pressed
//Variables for bricks
const brickRowCount = 15;
const brickColumnCount = 6;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 3;
const brickOffsetTop = 15;
const brickOffsetLeft = 15;
//Game variables
var score = 0;
var lives = 3;
var paused = false;
var requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;
var cancelAnimationFrame =
  window.cancelAnimationFrame || window.mozCancelAnimationFrame;
var myReq;

///////////////////////EVENT LISTENERS/////////////////////
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("touchstart", touchHandler);
document.addEventListener("touchmove", touchHandler);
// pauseButton.addEventListener("click", handlePause);
startButton.addEventListener("click", handleStart);
//////////////////////////////////////////////////////////

//////////////////////EVENT HANDLERS/////////////////////

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
  var relativeX = e.clientX - canvas.offsetLeft;
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
    var relativeX = e.touches[0].pageX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth / 2;
    }
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
    if (paddleX + paddleWidth < paddleWidth) {
      paddleX = 0;
    }
    // e.preventDefault();
  }
}

// function handlePause() {
//   if (!paused) {
//     paused = true;
//     pauseButton.textContent = "Resume";
//     console.log(paused);
//   } else if (paused) {
//     paused = false;
//     pauseButton.textContent = "Pause";
//     console.log(paused);
//   }
// }
//////////////////////////////////////////////////////////

//GAME LOGIC AND FUNCTIONS

function handleStart() {
  //RESTART FUNCTION
  function newLife() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = Math.floor(Math.random() * 5) + 5; //x motion direction
    dy = Math.floor(Math.random() * 5) + 5; // y motion direction
    paddleX = (canvas.width - paddleWidth) / 2;
  }
  /////////////////////////////////////////////

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
    ctx.fillStyle = "#053742";
    ctx.fill();
    ctx.closePath();
  }

  //BRICKS

  //Creating the bricks as a two-dimensional array using a for loop
  const bricks = [];
  for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  //Drawing the bricks in the canvas
  function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        var b = bricks[c][r];
        if (b.status === 1) {
          const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#000000";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  //Collision detection for the bricks

  function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        var b = bricks[c][r];
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
              // let button = document.getElementById("buttonAppear");
              // button.style.visibility = "visible";
              alert("YOU WON, CONGRATULATIONS!");
              newLife();
              score = 0;
              lives = 3;
            }
            scoreMarker.textContent = score;
          }
        }
      }
    }
  }

  function gameOver() {
    alert("GAME OVER");
    window.location.reload();
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
      // let tryAgainModal = document.getElementById("tryAgainModal");
      // tryAgainModal.style.visibility = "visible";
      // let tryAgainBtn = document.getElementById("tryAgainBtn");
      // tryAgainBtn.addEventListener("click", newLife);
      // tryAgainModal.style.visibility = "hidden";
      alert("Whoops!");
      newLife();
      if (!lives) {
        gameOver();
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
    var myReq = undefined;
    myReq = requestAnimationFrame(ballLoop);
    if (paused) {
      cancelAnimationFrame(myReq);
    }
    // var myReq = requestAnimationFrame(ballLoop);
    // if (!paused) {
    //   myReq = requestAnimationFrame(ballLoop);
    // } else {
    //   cancelAnimationFrame(myReq);
    // }
  }
  ballLoop();
}
