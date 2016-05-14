class DifficultyMeter {
  constructor(value) {
    this._numStars = 5;
    this._value = Math.min(value, this._numStars);
  }


  addTo(container) {
    container.name = "DifficultyMeter";

    if(this._value < 0) return;

    for(let i = 0; i < this._numStars; i++) {
      let difficultyStar = this.createStar(container.width, container.height, i);
      container.addChild(difficultyStar);
    }

  }

  createStar(width, height, value) {
    let starSize = Math.max(width / 80, height / 60);
    let padding = Math.max(width / 30, height / 25);

    let star = new createjs.Shape();
    if(value < this._value) {
      star.graphics.beginFill("#F0261B");
    } else {
      star.graphics.beginFill("#333333");
    }

    star.graphics.drawPolyStar(0, 0, starSize, 5, 0.6, -90);
    star.x = - ((this._numStars / 2 - value) * padding) + padding / 2;
    star.y = 0;

    return star;
  }

}
