/**
* CatchEmAll activity.
*/
class CatchEmAll {
  constructor(data) {
      this._data = data;
      this._hitList = [];
      this._missList = [];
      this._drawable = [];
      this._initialized = false;
      this._submitted = false;
  }

  init() {
    if(this._data.bg == undefined) this._data.bg = "img/apple-tree.jpg";
    this._drawable.push(new BackgroundImage(this._data.bg));
    this._drawable.push(new TitleDisplay(this._data.text));
    this._drawable.push(new DifficultyMeter(this._data.difficulty));

    switch(this._data.view) {
      case "student":
        this._drawable.push(new HeaderDisplay(`Score: ${this._data.score}`));
        this._timer = new TimeDisplay(this._data.time, this.submit.bind(this));
        this._drawable.push(this._timer);
        if(this._data.tooltip && this._data.tooltip != "") this._drawable.push(new TooltipInfo(this._data.tooltip));
        break;
      case "projector":
        this._drawable.push(new HeaderDisplay(this._data.screen));
        this._timer = new TimeDisplay(this._data.time, null);
        this._drawable.push(this._timer);
        break;
    }

    this._movingPlatform = new MovingPlatform();
    this._drawable.push(this._movingPlatform);
    this._drawable.push(new CatchField(this._data.answers, this._data.difficulty, this.hitTest.bind(this)));

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
      case "CatchField":
        container.x = 0;
        container.y = 0;
        break;
      case "MovingPlatform":
        container.x = 0;
        container.y = 0;
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

  hitTest(object) {
    let xPos = object.x;
    let radius = object.width / 2;
    let word = object.text;
    if(this._movingPlatform.hitTestBetween(xPos - radius, xPos + radius)) {
      if(this._hitList.indexOf(word) < 0) this._hitList.push(word);
      return true;
    } else {
      if(this._missList.indexOf(word) < 0) this._missList.push(word);
      return false;
    }
  }

  submit() {
    if(this._submitted) return;
    var obj = JSON.parse('{'
       + '"cmd" : "submit",'
       + '"activity" : "' + this._data.screen + '",'
       + '"id" : ' + this._data.id + ','
       + '"hits" : ' + JSON.stringify(this._hitList) + ','
       + '"misses" : ' + JSON.stringify(this._missList) + ','
       + '"time-left" : ' + this._timer.getTime()
       + '}');
    if(ServerConnection.send(obj)) {
      this._submitted = true;
      StageManager.handleActivityEnd(this);
    }
  }

}
