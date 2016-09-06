/**
* CatchEmAllSolution screen.
*/
class CatchEmAllSolution {
  constructor(data) {
      this._data = data;
      this._drawable = [];
      this._initialized = false;
  }

  init() {
    if(this._data.bg == undefined) this._data.bg = "img/apple-tree.jpg";
    this._drawable.push(new BackgroundImage(this._data.bg));
    this._drawable.push(new TitleDisplay(this._data.text));
    this._drawable.push(new DifficultyMeter(this._data.difficulty));
    this._drawable.push(new CorrectWrongDisplay(this._data.answers));

    if(this._data.view === "student") {
      this._drawable.push(new HeaderDisplay(`Score: +${this._data.score}`));
      if(this._data.tooltip && this._data.tooltip != "") this._drawable.push(new TooltipInfo(this._data.tooltip));
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
      case "CorrectWrongDisplay":
        container.x = 0;
        container.y = 0;
        break;
    }
  }


}
