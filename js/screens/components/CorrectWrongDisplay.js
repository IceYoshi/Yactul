class CorrectWrongDisplay {
  constructor(answers) {
    this._answers = answers;
  }

  addTo(container) {
    container.name = "CorrectWrongDisplay";

    let correctList = this.createWordList(this._answers.correct, true, container.width, container.height);
    correctList.y = container.height * 0.5;
    let wrongList = this.createWordList(this._answers.wrong, false, container.width, container.height);
    wrongList.y = container.height * 0.7;
    let panel = this.createBackgroundPanel(container.width * 0.95, container.height * 0.4)
    panel.x += container.width * 0.5;
    panel.y += container.height * 0.65;

    container.addChild(panel, correctList, wrongList);
  }

  createWordList(wordList, correct, width, height) {
    let fontSize = Math.floor(Math.max(width / 30, height / 25));
    let label = new createjs.Text();
    label.font = `${fontSize}px Dimbo`;
    label.lineWidth = width * 0.9;
    label.lineHeight = fontSize * 1.1;
    label.textAlign = "left";
    label.textBaseline = "middle";
    label.x = width * 0.05;

    if(correct) {
      label.text = "Correct: " + this.concatenateWords(wordList);
      label.color = "green";
    } else {
      label.text = "Wrong: " + this.concatenateWords(wordList);
      label.color = "#f0261b";
    }

    return label;
  }

  createBackgroundPanel(width, height) {
    let panel = new createjs.Container();

    let backgroundPanel = new createjs.Shape();
    backgroundPanel.graphics.beginFill("#d3d3d3").drawRect(0, 0, width, height);
    backgroundPanel.x = -width / 2;
    backgroundPanel.y = -height / 2;

    let divisor = this.createDivisorLine(width);

    panel.addChild(backgroundPanel, divisor);
    return panel;
  }

  createDivisorLine(width) {
    let line = new createjs.Shape();
    line.graphics.setStrokeStyle(3).beginStroke("black")
      .moveTo(- width / 2, 0)
      .lineTo(width / 2, 0)
      .endStroke();
    line.alpha = 0.5;
    return line;
  }

  concatenateWords(wordList) {
    let cList = "";
    for(let i = 0; i < wordList.length; i++) {
      if(i > 0) {
        cList += ", ";
      }
      cList += wordList[i];
    }
    return cList;
  }

}
