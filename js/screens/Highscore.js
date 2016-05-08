class Highscore {
  constructor(data) {
      this._data = data;
      this._drawable = [];
      this._initialized = false;
  }

  init() {
    this._drawable.push(new BackgroundImage(this._data.bg));
    this._drawable.push(new TitleDisplay("Highscore"));
    this._drawable.push(new HighscoreList(this._data.ranklist));

    if(this._data.best != undefined) {
      this._drawable.push(new FooterTextDisplay(`Best score in last round: ${this._data.best.name} (+${this._data.best.difference})`));
    }

    this._sparkleEffect = new SparkleEffect();
    this._drawable.push(this._sparkleEffect);

    this._initialized = true;
  }

  draw(screen) {
    if(!this._initialized) {
      this.init();
      setTimeout(function() {
        this._sparkleEffect.explosionAnimation(100, screen.width * 0.25, screen.height * 0.2, 1);
        this._sparkleEffect.explosionAnimation(100, screen.width * 0.75, screen.height * 0.2, 1);
      }.bind(this), 1000);
    }
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
    switch(container.name) {
      case "BackgroundImage":
        container.x = 0;
        container.y = 0;
        break;
      case "TitleDisplay":
        container.x = screen.width / 2;
        container.y = screen.height / 5;
        break;
      case "HighscoreList":
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
