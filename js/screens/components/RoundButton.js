class RoundButton {
  constructor(value, action) {
    this._value = value;
    this._action = action;
  }

  addTo(container) {
    container.name = "RoundButton";
    let radius = Math.min(container.width / 4, container.height / 5);

    let label = this.createLabel(container.width, container.height, this._value);
    let button = this.createBackgroundCircle(radius);

    container.addChild(button, label);
  }

  createLabel(width, height, value) {
    let fontSize = Math.floor(Math.min(width / 10, height / 10));
    let label = new createjs.Text();
    label.text = value.toString();
    label.font = `bold ${fontSize}px Dimbo`;
    label.color = "#d3d3d3";
    label.textBaseline = "middle";
    label.textAlign = "center";
    return label;
  }

  createBackgroundCircle(radius) {
    var bgCircle = new createjs.Shape();
    bgCircle.graphics.beginRadialGradientFill(["#F0261B","#C01E15"], [0, 1], 0, 0, 0, 0, 0, radius).drawCircle(0, 0, radius);
    bgCircle.shadow = new createjs.Shadow("#000000", 5, 5, 10);

    bgCircle.on("click", handleClick.bind(this));
    bgCircle.on("mouseover", handleMotion.bind(this));
    bgCircle.on("mouseout", handleMotion.bind(this));

    function handleClick(event) {
      if(this._action != null) {
        event.target.filters = [ new createjs.ColorFilter(0,0,0,1,144,22,16,0) ];
        event.target.cache(-radius, -radius, 2 * radius, 2 * radius);
        setTimeout(function() {
          event.target.filters = undefined;
          event.target.uncache();
        }, 150)
        this._action();
      }
    }

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

    return bgCircle;
  }

}
