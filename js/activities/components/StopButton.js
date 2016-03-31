class StopButton {
  constructor(screen, callback) {
    var radius = screen.width / 12;

    var stopLabel = new createjs.Text("Stop!", "bold 30px Arial", "#F0261B");
    stopLabel.textBaseline = "middle";
    stopLabel.x = screen.width / 2;
    stopLabel.y = screen.height * 0.75;
    stopLabel.textAlign = "center";

    var bgCircle = new createjs.Shape();
    bgCircle.graphics.beginFill("#d3d3d3").drawCircle(0, 0, radius );
    bgCircle.x = screen.width / 2;
    bgCircle.y = screen.height * 0.75;

    // mouse handlers
    bgCircle.on("click", handleClick);
    bgCircle.on("mouseover", handleMotion);
    bgCircle.on("mouseout", handleMotion);

    // validate click handler
    function handleClick(event) {
      if(callback != null) {
        event.target.filters = [ new createjs.ColorFilter(0,0,0,1,255,203,151,0) ];
        event.target.cache(-radius, -radius, 2 * radius, 2 * radius);
        if(callback != null) callback();
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
