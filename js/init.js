window.addEventListener('resize', resize);

function initCanvas() {
  StageManager.init("canvas"); // ID of canvas

  StageManager.idle(); // Change screen to idle

  //showFPS();
}

// Will be called whenever the browser window is resized.
// Effect: Adjusts canvas size to fill screen
function resize() {
  StageManager.resize();
}

// A console FPS display, primary for locating performance hits
function showFPS() {
  setTimeout(function() {
    let fpsCount = createjs.Ticker.getMeasuredFPS();
    fpsCount = Math.round(fpsCount * 100) / 100;
    console.log(`FPS: ${fpsCount}`);
    showFPS();
  }, 1000);
}
