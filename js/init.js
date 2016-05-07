window.addEventListener('resize', resize, false);

function init(serverAddress, pin, username) {
  /*
  serverAddress = "localhost";
  username = "iceyoshi";
  pin = "1234";
  */

  if(serverAddress && pin && username) {
    ServerConnection.init(`ws://${serverAddress}/yactul/ws/${pin}/${username}`);
  } else {
    ServerConnection.init();
  }

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
