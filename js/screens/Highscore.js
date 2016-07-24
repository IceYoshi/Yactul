/**
* Highscore screen
* Visual representation of the scores from the top 5 students.
* Can be updated in real time
* The student with the greatest score from the last activity is additionally
* displayed at the buttom of the screen.
*/
class Highscore {
  constructor(data) {
      this._data = data;
      this._drawable = [];
      this._initialized = false;
  }

  init() {
    if(this._data.bg == undefined) this._data.bg = "img/highscore.jpg";
    this._drawable.push(new BackgroundImage(this._data.bg));
    this._drawable.push(new TitleDisplay("Highscore"));
    this._ranklist = new HighscoreList(this._data.ranklist);
    this._drawable.push(this._ranklist);

    if(this._data.best) {
      this._footerDisplay = new FooterTextDisplay(`Best score in last round: ${this._data.best.name} (+${this._data.best.difference})`);
    } else {
      this._footerDisplay = new FooterTextDisplay('');
    }

    this._drawable.push(this._footerDisplay);

    this._fireworkEffect = new FireworkEffect();
    this._drawable.push(this._fireworkEffect);

    this._initialized = true;
  }

  draw(screen) {
    if(!this._initialized) {
      this.init();
      setTimeout(function() {
        this._fireworkEffect.explosionAnimation(50, screen.width * 0.2, screen.height * 0.2, 2);
        this._fireworkEffect.explosionAnimation(50, screen.width * 0.5, screen.height * 0.3, 2);
        this._fireworkEffect.explosionAnimation(50, screen.width * 0.8, screen.height * 0.2, 2);
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

  update(data) {
    switch (data.component) {
      case "highscore":
        this._ranklist.update(data.ranklist);
        if(data.best) {
          this._footerDisplay.update(`Best score in last round: ${data.best.name} (+${data.best.difference})`);
        }
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
