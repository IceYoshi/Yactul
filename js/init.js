window.addEventListener('resize', resize, false);

function init() {
  ServerConnection.init("example.lu/rest/");
  StageManager.init("canvas"); // ID of canvas

  StageManager.idle();
}

function resize() {
  StageManager.resize();
}
