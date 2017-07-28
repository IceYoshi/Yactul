class LabelIterator {
  constructor(values, interval, onChange) {
    this._values = values;
    this._interval = Math.max(interval, 0);
    this.onChange = onChange;
    this._currentIndex = 0;
    this._running = false;
  }

  addTo(container) {
    container.name = "LabelIterator";
    this._label = this.createLabel(container.width, container.height);

    if(!this._running) {
      this._running = true;
      this.tick();
    } else {
      this.updateLabel();
      this.updateColor();
    }

    container.addChild(this._label);
  }

  createLabel(width, height) {
    let fontSize = Math.floor(Math.max(width / 20, height / 20));
    let label = new createjs.Text();
    label.font = `${fontSize}px Dimbo`;
    label.color = "#000";
    label.textAlign = "center";
    label.textBaseline = "middle";
    return label;
  }

  updateLabel() {
    this._label.text = Common.decodeHtml(this._values[this._currentIndex]);
  }

  tick() {
    this.updateLabel();
    this.updateColor();
    this._label.persistant = true;
    createjs.Tween.get(this._label, { loop: false })
      .wait(this._interval)
      .call(function() {
        this._currentIndex = (this._currentIndex + 1) % this._values.length;
        this.tick();
      }.bind(this));
  }

  updateColor() {
    if(this.onChange != null) {
      let isSelected = this.onChange(this._values[this._currentIndex]);
      if(isSelected) {
        this._label.color = "#f0261b";
      } else {
        this._label.color = "#000";
      }
    }
  }

}
