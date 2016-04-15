class PointAndClick {
  constructor(data) {
      this._data = data;
      this._selected = [];
      this._submitted = false;
  }

  draw(stage) {
    switch (this._data.view) {
      case "student":
        new BackgroundImage(stage, this._data.bg);
        this._timer = new Timer(stage, this._data.time, this.submit.bind(this));
        new DifficultyMeter(stage, this._data.difficulty);
        new Title(stage, this._data.text);
        new InteractiveImage(stage, this._data.imagePath, this.selected.bind(this));
        break;
      case "projector":
        new BackgroundImage(stage, this._data.bg);
        this._timer = new Timer(stage, this._data.time, null);
        new DifficultyMeter(stage, this._data.difficulty);
        new Title(stage, this._data.text);
        new InteractiveImage(stage, this._data.imagePath, null);
        break;
    }
  }

  selected(value) {
    this._selected = value;
    this.submit();
  }

  get timer() {
    return this._timer;
  }

  update(data) {
    switch(data.component) {
      case "timer":
        if(data.type === "absolute")
          this._timer.update(data.value);
        if(data.type === "relative")
          this._timer.change(data.value);
        break;
      default: throw new Error();
    }
  }

  submit() {
    if(this._submitted) return;
    var obj = JSON.parse('{'
       +'"cmd" : "submit",'
       + '"activity" : "' + this._data.activity + '",'
       + '"id" : ' + this._data.id + ','
       +'"selected" : ' + JSON.stringify(this._selected)
       +'}');
    if(ServerConnection.send(obj)) {
      this._submitted = true;
      StageManager.idle();
    }
  }

}
