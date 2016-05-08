window.addEventListener('resize', resize, false);

function initCanvas(serverAddress, pin, username) {
  StageManager.init("canvas"); // ID of canvas

  StageManager.idle();

  //showFPS();
}

function resize() {
  StageManager.resize();
}

function showFPS() {
  setTimeout(function() {
    let fpsCount = createjs.Ticker.getMeasuredFPS();
    fpsCount = Math.round(fpsCount * 100) / 100;
    console.log(`FPS: ${fpsCount}`);
    showFPS();
  }, 1000);
}
