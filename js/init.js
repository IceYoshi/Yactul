window.addEventListener('resize', resize, false);

function init() {
  let username = "iceyoshi";
  let pin = "1234";

  ServerConnection.init();
  //ServerConnection.init(`ws://10.191.0.230:8080/yactul/ws/${pin}/${username}`);

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
