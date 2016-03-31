class OwlEyes {
  constructor(data) {
      this._data = data;
      this._answer = [];
      this._submitted = false;
  }

  draw(stage) {
    switch (this._data.view) {
      case "student":
        new BackgroundImage(stage, this._data.image);
        new Timer(stage, this._data.time, this.submit.bind(this));
        new Title(stage, this._data.question);
        new AnswerCycle(stage, this._data.answers, this.setAnswer.bind(this));
        new StopButton(stage, this.submit.bind(this));
        break;
      case "projector":
        new BackgroundImage(stage, this._data.image);
        new Timer(stage, this._data.time, null);
        new Title(stage, this._data.question);
        new AnswerCycle(stage, this._data.answers, null);
        new StopButton(stage, null);
        break;
    }
  }

  setAnswer(answer) {
    this._answer = answer;
  }

  submit() {
    if(this._submitted) return;
    var obj = JSON.parse('{'
       +'"cmd" : "submit",'
       +'"activity"  : "OwlEyes",'
       + '"id" : ' + this._data.id + ','
       +'"answer" : ' + JSON.stringify(this._answer)
       +'}');
    if(ServerConnection.send(obj)) {
      this._submitted = true;
      StageManager.idle();
    }
  }

}
