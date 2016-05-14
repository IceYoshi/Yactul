/**
* SimpleQuestion activity.
* There is a question title and answer buttons which can be clicked. Only
* one answer can be choosen. The selected answer is then submitted to the server
* Optionally, a forground image can be set.
*/
class SimpleQuestion {
  constructor(data) {
      this._data = data;
      this._selected = [null];
      this._drawable = [];
      this._initialized = false;
      this._submitted = false;
  }

  init() {
    this._drawable.push(new BackgroundImage(this._data.bg));
    this._drawable.push(new TitleDisplay(this._data.text));
    this._drawable.push(new DifficultyMeter(this._data.difficulty));
    if(this._data.image) {
      this._hasDisplayImage = true;
      this._drawable.push(new DisplayImage(this._data.image));
    }

    switch(this._data.view) {
      case "student":
        this._drawable.push(new HeaderDisplay(`Score: ${this._data.score}`));
        this._timer = new TimeDisplay(this._data.time, this.submit.bind(this));
        this._drawable.push(this._timer);
        this._drawable.push(new ButtonPanel(this._data.answers, this._hasDisplayImage, this.selected.bind(this), this._data.stats));
        break;
      case "projector":
        this._drawable.push(new HeaderDisplay(this._data.screen));
        this._timer = new TimeDisplay(this._data.time, null);
        this._drawable.push(this._timer);
        this._drawable.push(new ButtonPanel(this._data.answers, this._hasDisplayImage, null, this._data.stats));
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
      case "ButtonPanel":
        container.x = screen.width / 2;
        if(this._hasDisplayImage && landscape) container.x += screen.width / 4;
        container.y = screen.height * 0.67;
        if(this._hasDisplayImage && !landscape) container.y = screen.height * 0.8;
        break;
      case "DisplayImage":
        if(landscape) {
          container.x = screen.width / 4;
          container.y = screen.height * 0.67;
        } else {
          container.x = screen.width / 2;
          container.y = screen.height * 0.46;
        }
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
    this.submit();
  }

  submit() {
    if(this._submitted) return;
    var obj = JSON.parse('{'
       + '"cmd" : "submit",'
       + '"activity" : "' + this._data.screen + '",'
       + '"id" : ' + this._data.id + ','
       + '"selected" : ' + JSON.stringify(this._selected[0]) + ','
       + '"time-left" : ' + this._timer.getTime()
       + '}');
    if(ServerConnection.send(obj)) {
      this._submitted = true;
      StageManager.idle();
    }
  }

}
