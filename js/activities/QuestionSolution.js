class QuestionSolution {
  constructor(data) {
      this._data = data;
  }

  draw(stage) {
    new BackgroundImage(stage, this._data.bg);
    new DifficultyMeter(stage, this._data.difficulty);
    new Title(stage, this._data.text);
    new AnswerButtons(stage, this._data.answers, null, this._data.image != undefined, this._data.stats);
    new DisplayImage(stage, this._data.image);
  }

}
