window.addEventListener('resize', resize, false);

function init() {
  ServerConnection.init("example.lu/rest/");
  StageManager.init("canvas"); // ID of canvas

  StageManager.idle();
  resize();
}

function resize() {
  StageManager.resize(true);
}
