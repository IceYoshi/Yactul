class AnswerCycle {
  constructor(screen, answers, callback) {
    if(answers.length > 0) {
      // cyclic answer label
      var cycleLabel = new createjs.Text(answers[0], "30px Dimbo", "#000");
      cycleLabel.x = screen.width / 2;
      cycleLabel.y = screen.height * 0.4;
      cycleLabel.textAlign = "center";

      this._label = cycleLabel;
      this._sleepTime = 1500;
      this._callback = callback;
      this._answers = answers;

      this.update(0);

      screen.addChild(cycleLabel);
    }

  }

  update(i) {
    if(this._callback != null) {
      this.updateColor(this._callback(this._answers[i]));
    }
    this._label.text = this._answers[i];
    createjs.Tween.get(this._label, { loop: false })
      .wait(this._sleepTime)
      .call(function() {
        this.update(++i % this._answers.length);
      }.bind(this));
  }

  updateColor(isSelected) {
    if(isSelected) {
      this._label.color = "#F0261B";
    } else {
      this._label.color = "#000";
    }
  }
}
