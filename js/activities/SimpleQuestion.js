class SimpleQuestion {
  constructor(data) {
      this._data = data;
      this._selected = [null];
      this._submitted = false;
  }

  draw(stage) {
    switch (this._data.view) {
      case "student":
        new BackgroundImage(stage, this._data.bg);
        new Timer(stage, this._data.time, this.submit.bind(this));
        new Title(stage, this._data.text);
        new AnswerButtons(stage, this._data.answers, this.selected.bind(this));
        break;
      case "projector":
        new BackgroundImage(stage, this._data.bg);
        new Timer(stage, this._data.time, null);
        new Title(stage, this._data.text);
        new AnswerButtons(stage, this._data.answers, null);
        break;
    }
  }

  selected(value) {
    this._selected = value;
    this.submit();
  }

  submit() {
    if(this._submitted) return;
    var obj = JSON.parse('{'
       + '"cmd" : "submit",'
       + '"activity" : "' + this._data.activity + '",'
       + '"id" : ' + this._data.id + ','
       + '"selected" : ' + JSON.stringify(this._selected[0])
       + '}');
    if(ServerConnection.send(obj)) {
      this._submitted = true;
      StageManager.idle();
    }
  }

}
