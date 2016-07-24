/**
* Race screen
* Visual representation of the race progress for each group.
* Can be updated in real time.
*/
class Race {
  constructor(data) {
      this._data = data;
      this._drawable = [];
      this._initialized = false;
  }

  init() {
    if(this._data.bg == undefined) this._data.bg = "img/highscore.jpg";
    this._drawable.push(new BackgroundImage(this._data.bg));
    this._drawable.push(new TitleDisplay('Race'));
    this._rpd = new RaceProgressionDisplay(this._data.groups, this._data.steps);
    this._drawable.push(this._rpd);

    this._footerDisplay = new FooterTextDisplay('');
    this._drawable.push(this._footerDisplay);

    this._fireworkEffect = new FireworkEffect();
    this._drawable.push(this._fireworkEffect);

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

  update(data) {
    switch (data.component) {
      case "rpd":
        if(this._rpd.update(data.group, data.value))
          this._footerDisplay.update(`Last move: ${data.group} (${data.value >= 0 ? "+"+data.value : data.value})`);
        break;
      default: throw new Error();
    }
  }

  setOrigin(container, screen) {
    switch(container.name) {
      case "BackgroundImage":
        container.x = 0;
        container.y = 0;
        break;
      case "TitleDisplay":
        container.x = screen.width / 2;
        container.y = screen.height / 5;
        break;
      case "RaceProgressionDisplay":
        container.x = screen.width / 2;
        container.y = screen.height / 3;
        break;
      case "FooterTextDisplay":
        container.x = screen.width / 2;
        container.y = screen.height;
        break;
    }
  }

}
