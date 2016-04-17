class Focus {
  constructor(data) {
      this._data = data;
      this._selected = [null];
      this._submitted = false;
  }

  draw(stage, score) {
    switch (this._data.view) {
      case "student":
        new BackgroundImage(stage, this._data.bg);
        this._timer = new Timer(stage, this._data.time, this.submit.bind(this));
        new DifficultyMeter(stage, this._data.difficulty);
        new Score(stage, "Score: " + score.toString());
        new Title(stage, this._data.text);
        new AnswerCycle(stage, this._data.answers, this.selected.bind(this));
        new StopButton(stage, this.submit.bind(this));
        break;
      case "projector":
        new BackgroundImage(stage, this._data.bg);
        this._timer = new Timer(stage, this._data.time, null);
        new DifficultyMeter(stage, this._data.difficulty);
        new Score(stage, this._data.activity);
        new Title(stage, this._data.text);
        new AnswerCycle(stage, this._data.answers, null);
        new StopButton(stage, null);
        break;
    }
  }

  selected(value) {
    this._selected = value;
  }

  update(data) {
    switch(data.component) {
      case "timer":
        if(data.type === "absolute")
          this._timer.update(data.value);
        if(data.type === "relative")
          this._timer.change(data.value);
        if(data.type === "pause")
          this._timer.stop();
        if(data.type === "resume")
          this._timer.start();
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
       +'"selected" : ' + JSON.stringify(this._selected[0])
       +'}');
    if(ServerConnection.send(obj)) {
      this._submitted = true;
      StageManager.idle();
    }
  }

}
