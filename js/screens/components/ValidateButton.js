class ValidateButton {
  constructor(submit) {
    this._submit = submit;
  }

  addTo(container) {
    container.name = "ValidateButton";
    let label = this.createLabel(container.width, container.height);
    let panel = this.createBackgroundPanel(label.getMeasuredWidth(), label.getMeasuredHeight());
    container.addChild(panel, label);
  }

  createLabel(width, height) {
    let fontSize = Math.floor(Math.max(width / 23, height / 20));
    let label = new createjs.Text();
    label.text = "Validate";
    label.font = `${fontSize}px Dimbo`;
    label.color = "#f0261b";
    label.textAlign = "right";
    label.textBaseline = "bottom";
    return label
  }

  createBackgroundPanel(labelWidth, labelHeight) {
    let width = labelWidth + labelHeight / 2;
    let height = 3/2 * labelHeight;
    let panel = new createjs.Shape();
    panel.graphics.beginFill("#d3d3d3").drawRoundRectComplex(0, 0,
      width, height,
       labelHeight, 0, 0, 0);
    panel.x = -width;
    panel.y = -height;

    panel.on("click", handleClick.bind(this));
    panel.on("mouseover", handleMotion.bind(this));
    panel.on("mouseout", handleMotion.bind(this));


    function handleClick(event) {
      if(this._submit != null) {
        event.target.filters = [ new createjs.ColorFilter(0,0,0,1,255,203,151,0) ];
        event.target.cache(0, 0, event.target.graphics.command.w, event.target.graphics.command.h);
        this._submit();
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
      event.target.cache(0, 0, event.target.graphics.command.w, event.target.graphics.command.h);
    }

    return panel;
  }

}
