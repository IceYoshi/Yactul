class ValidateButton {
  constructor(screen, callback) {
    // validate label
    var validateLabel = new createjs.Text("Validate", "30px Dimbo", "#F0261B");
    validateLabel.x = screen.width;
    validateLabel.y = screen.height;
    validateLabel.textAlign = "right";
    validateLabel.textBaseline = "alphabetic";

    // validate background
    var validateRect = new createjs.Shape();
    validateRect.graphics.beginFill("#d3d3d3").drawRoundRectComplex(0, 0,
      validateLabel.getMeasuredWidth() + validateLabel.getMeasuredHeight() / 2, 3/2 * validateLabel.getMeasuredHeight(),
       validateLabel.getMeasuredHeight(), 0, 0, 0);
    validateRect.x = screen.width - validateLabel.getMeasuredWidth() - validateLabel.getMeasuredHeight() / 2;
    validateRect.y = screen.height - 4/3 * validateLabel.getMeasuredHeight();

    // mouse handlers
    validateRect.on("click", handleClick);
    validateRect.on("mouseover", handleMotion);
    validateRect.on("mouseout", handleMotion);

    // validate click handler
    function handleClick(event) {
      if(callback != null) {
        event.target.filters = [ new createjs.ColorFilter(0,0,0,1,255,203,151,0) ];
        event.target.cache(0, 0, event.target.graphics.command.w, event.target.graphics.command.h);
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
      event.target.cache(0, 0, event.target.graphics.command.w, event.target.graphics.command.h);
    }

    screen.addChild(validateRect);
    screen.addChild(validateLabel);
  }

}
