/**
* MultipleChoiceFocus activity.
* A variant of the SimpleFocus activity. Instead of having a stop button,
* a select button is shown. Like the name suggests, whenever the select button
* is clicked, the currently shown answer is selected or un-selected.
* After submission, the list of all selected answers is send to the server.
*/
class MultipleChoiceFocus {
  constructor(data) {
      this._data = data;
      this._currentItem = null;
      this._selected = [];
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
        this._labelIterator = new LabelIterator(this._data.answers, this._data.interval, this.currentItem.bind(this));
        this._drawable.push(this._labelIterator);
        this._drawable.push(new RoundButton("Select !", this.select.bind(this)));
        this._drawable.push(new SubmitButton(this.submit.bind(this)));
        if(this._data.tooltip && this._data.tooltip != "") this._drawable.push(new TooltipInfo(this._data.tooltip));
        break;
      case "projector":
        this._drawable.push(new HeaderDisplay(this._data.screen));
        this._timer = new TimeDisplay(this._data.time, null);
        this._drawable.push(this._timer);
        this._labelIterator = new LabelIterator(this._data.answers, 1500, null);
        this._drawable.push(this._labelIterator);
        this._drawable.push(new RoundButton("Select !", null));
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
      case "SubmitButton":
        container.x = screen.width;
        container.y = screen.height;
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

  currentItem(value) {
    this._currentItem = value;
    if(this._selected.indexOf(value) > -1)
      return true;
    return false;
  }

  select() {
    var item = this._currentItem;
    var index = this._selected.indexOf(item);
    if(index > -1) {
      this._selected.splice(index, 1);
      this._labelIterator.updateColor(false);
    } else {
      this._selected.push(item);
      this._labelIterator.updateColor(true);
    }

  }

  submit() {
    if(this._submitted) return;
    var obj = JSON.parse('{'
       + '"cmd" : "submit",'
       + '"activity" : "' + this._data.screen + '",'
       + '"id" : ' + this._data.id + ','
       + '"selected" : ' + JSON.stringify(this._selected) + ','
       + '"time-left" : ' + this._timer.getTime()
       + '}');
    if(ServerConnection.send(obj)) {
      this._submitted = true;
      StageManager.handleActivityEnd(this);
    }
  }

}
