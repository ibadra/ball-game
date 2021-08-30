const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");
window.addEventListener("resize", resizeCanvas, false);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  /**
   * Your drawings need to be inside this function otherwise they will be reset when
   * you resize the browser window and the canvas goes will be cleared.
   */
  drawStuff();
}

resizeCanvas();

function drawStuff() {
  // do your drawing stuff here
}
