class StopButton {
  constructor(screen, callback) {
    var radius = Math.min(screen.width / 6, screen.height / 5);

    var stopLabel = new createjs.Text("Stop !", "bold 40px Dimbo", "#d3d3d3");
    stopLabel.textBaseline = "middle";
    stopLabel.x = screen.width / 2;
    stopLabel.y = screen.height * 0.75;
    stopLabel.textAlign = "center";

    var bgCircle = new createjs.Shape();
    bgCircle.graphics.beginRadialGradientFill(["#F0261B","#C01E15"], [0, 1], 0, 0, 0, 0, 0, radius).drawCircle(0, 0, radius);
    bgCircle.x = screen.width / 2;
    bgCircle.y = screen.height * 0.75;
    bgCircle.shadow = new createjs.Shadow("#000000", 5, 5, 10);

    // mouse handlers
    bgCircle.on("click", handleClick);
    bgCircle.on("mouseover", handleMotion);
    bgCircle.on("mouseout", handleMotion);

    // validate click handler
    function handleClick(event) {
      if(callback != null) {
        event.target.filters = [ new createjs.ColorFilter(0,0,0,1,144,22,16,0) ];
        event.target.cache(-radius, -radius, 2 * radius, 2 * radius);
        setTimeout(function() {
          event.target.filters = undefined;
          event.target.uncache();
        }, 150)
        callback();
      }
    }

    // mouseover animation
    function handleMotion(event) {
      switch(event.type) {
        case "mouseover":
          // r, g, b, a - multiply old values, then add offset to them
          event.target.filters = [ new createjs.ColorFilter(1,1,1,1,-25,-25,-25,0) ];
          break;
        case "mouseout":
          event.target.filters = [ new createjs.ColorFilter(1,1,1,1,0,0,0,0) ];
          break;
      }
      event.target.cache(-radius, -radius, 2 * radius, 2 * radius);
    }

    screen.addChild(bgCircle);
    screen.addChild(stopLabel);
  }
}
