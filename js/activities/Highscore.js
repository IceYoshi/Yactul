class Highscore {
  constructor(data) {
      this._data = data;
  }

  draw(stage) {
    new BackgroundImage(stage, "img/highscore.jpg");
    new Title(stage, "Highscore");
    new HighscoreList(stage, this._data.ranklist);
    if(this._data.best != undefined) {
      new BestPlayer(stage, `Best score in last round: ${this._data.best.name} (+${this._data.best.score})`);
    }

  }

}
