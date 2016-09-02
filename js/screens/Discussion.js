/**
*
*/

class Discussion {
  constructor(data) {
      this._data = data;
      this._drawable = [];
      this._initialized = false;
      this._submitted = false;
  }

  init() {
    if(this._data.bg == undefined) this._data.bg = "img/idle.jpg";
    this._drawable.push(new BackgroundImage(this._data.bg));
    this._drawable.push(new DifficultyMeter(this._data.difficulty));
    this._drawable.push(new TitleDisplay(this._data.text));

    switch(this._data.view) {
      case "student":
        this._drawable.push(new HeaderDisplay(`Score: ${this._data.score}`));
        this._timer = new TimeDisplay(this._data.time, this.submit.bind(this));
        this._drawable.push(this._timer);
        this._drawable.push(new TextBox(this.sendAnswer.bind(this)));
        break;
      case "projector":
        this._drawable.push(new HeaderDisplay(this._data.screen));
        this._timer = new TimeDisplay(this._data.time, null);
        this._drawable.push(this._timer);
        break;
    }
    this._initialized = true;
  }

  draw(screen) {
    if(!this._initialized) this.init();
    this._drawable.forEach(function(component) {
      let container = new createjs.Container();
      container.width = screen.width;
      container.height = screen.height;
      component.addTo(container);
      this.setOrigin(container, screen);
      screen.addChild(container);
    }.bind(this));
  }

  setOrigin(container, screen) {
    let landscape = screen.width >= screen.height;
    switch(container.name) {
      case "BackgroundImage":
        container.x = 0;
        container.y = 0;
        break;
      case "HeaderDisplay":
        container.x = 0;
        container.y = 0;
        break;
      case "TimeDisplay":
        container.x = screen.width;
        container.y = 0;
        break;
      case "TitleDisplay":
        container.x = screen.width / 2;
        container.y = screen.height / 5;
        break;
      case "DifficultyMeter":
        container.x = screen.width / 2;
        container.y = screen.height / 20;
        break;
      case "TextBox":
        container.x = screen.width * 0.5 / window.devicePixelRatio;
        container.y = screen.height * 0.8 / window.devicePixelRatio;
        break;
    }
  }

  update(data) {
    switch(data.component) {
      case "timer":
        if(data.type === "absolute")
          this._timer.updateTime(data.value);
        if(data.type === "relative")
          this._timer.changeTime(data.value);
        if(data.type === "pause")
          this._timer.stopTimer();
        if(data.type === "resume")
          this._timer.startTimer();
        break;
      default: throw new Error();
    }
  }

  sendAnswer(answer) {
    if(this._submitted) return;
    let obj = JSON.parse('{'
       + '"cmd" : "submit",'
       + '"activity" : "' + this._data.screen + '",'
       + '"id" : ' + this._data.id + ','
       + '"answer" : ' + JSON.stringify(answer)
       + '}');
    ServerConnection.send(obj);
  }

  submit() {
    if(this._submitted) return;
    this._submitted = true;
    StageManager.handleActivityEnd(this);
  }

}
