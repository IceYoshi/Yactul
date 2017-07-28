class TitleDisplay {
  constructor(value) {
    this._value = value;
  }

  addTo(container) {
    container.name = "TitleDisplay";
    let width = container.width * 0.75;
    let height = container.height / 13;

    let label = this.createLabel(width, height);
    let panel = this.createBackgroundPanel(width, height, label.getMeasuredHeight());
    container.addChild(panel, label);
  }

  createLabel(width, height) {
    let fontSize = Math.floor(Math.max(width / 22 + 5, height / 4 + 30));
    let label = new createjs.Text();
    label.text = Common.decodeHtml(this._value.toString());
    label.font = `${fontSize}px Dimbo`;
    label.color = "#f0261b";
    label.lineWidth = width - width / 15;
    label.lineHeight = height;
    label.textAlign = "center";
    label.textBaseline = "middle";

    while(label.getMeasuredHeight() > height * 2) {
      fontSize -= 2;
      label.font = `${fontSize}px Dimbo`;
    }

    return label;
  }

  createBackgroundPanel(width, height, labelHeight) {
    let numOfLines = labelHeight / height;
    let panelHeight = height * numOfLines + height / 2;

    let panel = new createjs.Shape();
    panel.graphics.beginFill("#d3d3d3").drawRoundRect(0, 0, width, panelHeight, height / 2);
    panel.x = -width / 2
    panel.y = height / 4 - height;
    return panel;
  }

}
