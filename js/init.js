StageManager.init("canvas"); // ID of canvas
ServerConnection.init("example.lu/rest/");

window.addEventListener('resize', resize, false);

window.onerror = function(error) {
  // show error message when there is no console access (e.g. on mobile devices)
  alert(error);
};

function init() {
  StageManager.idle();
}

function resize() {
  StageManager.resize();
}
