class Highscore {
  constructor(data) {
      this._data = data;
  }

  draw(stage) {
    new BackgroundImage(stage, "img/highscore.jpg");
    new Title(stage, "Highscore");
    new HighscoreList(stage, this._data.ranklist);
  }

}
