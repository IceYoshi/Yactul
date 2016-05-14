/**
* QuestionSolution screen.
* The correct and wrong answers of the previously played Question or Focus activity
* (both simple and multiple choice variants) are displayed.
* Additionally, some statistical numbers of the answers selected by the other students
* is shown.
*/
class QuestionSolution {
  constructor(data) {
      this._data = data;
      this._drawable = [];
      this._initialized = false;
  }

  init() {
    this._drawable.push(new BackgroundImage(this._data.bg));
    this._drawable.push(new TitleDisplay(this._data.text));
    this._drawable.push(new DifficultyMeter(this._data.difficulty));
    if(this._data.image) {
      this._hasDisplayImage = true;
      this._drawable.push(new DisplayImage(this._data.image));
    }
    this._drawable.push(new ButtonPanel(this._data.answers, this._hasDisplayImage, null, this._data.stats));

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
      case "HeaderDisplay":
        container.x = 0;
        container.y = 0;
        break;
      }
  }

}
