/**
* SimpleFocus activity.
* A question title will be shown. Sequentially, one answer at a time from a answer pool will
* be shown. When the stop button is clicked, the currently shown answer will be submitted.
*/
class SimpleFocus {
  constructor(data) {
      this._data = data;
      this._selected = null;
      this._drawable = [];
      this._initialized = false;
      this._submitted = false;
  }

  init() {
    if(this._data.bg == undefined) this._data.bg = "img/quiz-background3.jpg";
    this._drawable.push(new BackgroundImage(this._data.bg));
    this._drawable.push(new TitleDisplay(this._data.text));
    this._drawable.push(new DifficultyMeter(this._data.difficulty));

    switch(this._data.view) {
      case "student":
        this._drawable.push(new HeaderDisplay(`Score: ${this._data.score}`));
        this._timer = new TimeDisplay(this._data.time, this.submit.bind(this));
        this._drawable.push(this._timer);
        this._drawable.push(new LabelIterator(this._data.answers, this._data.interval, this.selected.bind(this)));
        this._drawable.push(new RoundButton("Stop !", this.submit.bind(this)));
        if(this._data.tooltip && this._data.tooltip != "") this._drawable.push(new TooltipInfo(this._data.tooltip));
        break;
      case "projector":
        this._drawable.push(new HeaderDisplay(this._data.screen));
        this._timer = new TimeDisplay(this._data.time, null);
        this._drawable.push(this._timer);
        this._drawable.push(new LabelIterator(this._data.answers, 1500, null));
        this._drawable.push(new RoundButton("Stop !", null));
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
      case "RoundButton":
        container.x = screen.width / 2;
        container.y = screen.height * 0.75;
        break;
      case "LabelIterator":
        container.x = screen.width / 2;
        container.y = screen.height * 0.45;
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

  selected(value) {
    this._selected = value;
  }

  //If value defined it means the action was triggered by a user, and not a timer, allowing us to differentiate and send the correct selected element. REFER Issue #36
  submit(value) {
    if(this._submitted) return;
    var realselected;
    if (value == null) {
      realselected = null;
    }else{
      realselected = this._selected;
    }
    var obj = JSON.parse('{'
       + '"cmd" : "submit",'
       + '"activity" : "' + this._data.screen + '",'
       + '"id" : ' + this._data.id + ','
       + '"selected" : ' + JSON.stringify(realselected) + ','
       + '"time-left" : ' + this._timer.getTime()
       + '}');
    if(ServerConnection.send(obj)) {
      this._submitted = true;
      StageManager.handleActivityEnd(this);
    }
  }

}
