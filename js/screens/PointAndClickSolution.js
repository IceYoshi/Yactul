/**
* PointAndClickSolution screen.
* The image area that would be interpreted as being the correct answer to
* the question is shown as green. This area can be described as a polygon or
* as a circle.
* Additionally, the positions of the points clicked by other students is being
* shown.
*/
class PointAndClickSolution {
  constructor(data) {
      this._data = data;
      this._selected = [];
      this._drawable = [];
      this._initialized = false;
      this._submitted = false;
  }

  init() {
    if(this._data.bg == undefined) this._data.bg = "img/europe.jpg";
    this._drawable.push(new BackgroundImage(this._data.bg));
    this._drawable.push(new TitleDisplay(this._data.text));
    this._drawable.push(new DifficultyMeter(this._data.difficulty));
    this._drawable.push(new InteractiveImage(this._data.image, null, this._data.stats));

    if(this._data.view === "student") {
      this._drawable.push(new HeaderDisplay(`Score: +${this._data.score}`));
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
      case "TitleDisplay":
        container.x = screen.width / 2;
        container.y = screen.height / 5;
        break;
      case "DifficultyMeter":
        container.x = screen.width / 2;
        container.y = screen.height / 20;
        break;
      case "InteractiveImage":
        container.x = screen.width / 2;
        container.y = screen.height * 0.65;
        break;
    }
  }
}
