StageManager.init("canvas"); // ID of canvas
ServerConnection.init("example.lu/rest/");

window.addEventListener('resize', resize, false);

function init() {
  StageManager.idle();
}

function resize() {
  StageManager.resize();
}
