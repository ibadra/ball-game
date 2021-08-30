const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");
// window.addEventListener("resize", resizeCanvas, false);

// function resizeCanvas() {
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;

//   /**
//    * The drawings need to be inside this function otherwise they will be reset when
//    * you resize the browser window and the canvas goes will be cleared.
//    */
drawCanvas();
// }

// resizeCanvas();

function drawCanvas() {
  //Variables
  var x = canvas.width / 2;
  var y = canvas.height - 30;
  var dx = -6; //x motion direction
  var dy = -2; // y morion direction
  ballRadius = 20; //Used for collision detection

  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  }

  function ballLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    x += dx;
    y += dy;
    if (y + dy < ballRadius || y + dy > canvas.height - ballRadius) {
      dy = -dy;
    } else if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
      dx = -dx;
    }
  }
  setInterval(ballLoop, 20);
}
