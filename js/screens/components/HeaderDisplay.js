class HeaderDisplay {
  constructor(value) {
    this._value = value;
  }

  addTo(container) {
    container.name = "HeaderDisplay";
    let label = this.createLabel(container.width, container.height, this._value);
    let panel = this.createBackgroundPanel(label.getMeasuredWidth(), label.getMeasuredHeight());
    container.addChild(panel, label);
  }

  createLabel(width, height, value) {
    let fontSize = Math.floor(Math.max(width / 23, height / 20));
    let label = new createjs.Text();
    label.text = value.toString();
    label.font = `${fontSize}px Dimbo`;
    label.color = "#f0261b";
    label.textAlign = "left";
    label.textBaseline = "top";
    return label;
  }

  createBackgroundPanel(labelWidth, labelHeight) {
    let panel = new createjs.Shape();
    panel.graphics.beginFill("#d3d3d3").drawRoundRectComplex(0, 0,
      labelWidth + labelHeight / 2, 3/2 * labelHeight,
      0, 0, labelHeight, 0);
    return panel;
  }

}
