window.addEventListener('resize', resize);

function initCanvas() {
  StageManager.init("canvas"); // ID of canvas

  StageManager.idle(); // Change screen to idle

  showDebugInformation();
}

// Will be called whenever the browser window is resized.
// Effect: Adjusts canvas size to fill screen
function resize() {
  StageManager.resize();
}

// A console FPS display, primary for locating performance hits
function showDebugInformation() {
  setTimeout(function() {
    let fpsCount = createjs.Ticker.getMeasuredFPS();
    fpsCount = Math.round(fpsCount * 100) / 100;
    console.log(`FPS: ${fpsCount} | Active tweens: ${createjs.Tween._tweens.length} | Ticker job count: ${createjs.Ticker._listeners["tick"].length}`);
    showDebugInformation();
  }, 1000);
}
