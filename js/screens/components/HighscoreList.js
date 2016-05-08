class HighscoreList {
  constructor(ranklist) {
    this._ranklist = ranklist;
  }

  addTo(container) {
    container.name = "HighscoreList";

    let rowWidth = container.width * 0.9;
    let rowHeight = container.height / 9;


    for(let i = 0; i < this._ranklist.length; i++) {
      let x = - rowWidth / 2;
      let y = rowHeight * i;
      let entry = this._ranklist[i];
      let baseSize = Math.min(container.width * 0.8, container.height * 0.8) / (9 * window.devicePixelRatio);
      let fontSize = baseSize - baseSize / 5 * Math.min(i, 2.5);
      let iconSize = fontSize / 80 * rowHeight;

      let backgroundPanel = this.createBackgroundPanel(rowWidth, rowHeight, i);
      backgroundPanel.x = x;
      backgroundPanel.y = y;

      let rankLabel = this.createRankLabel(fontSize, i);
      rankLabel.x = x + rowWidth * 0.15;
      rankLabel.y = y + rowHeight / 2;

      let nameLabel = this.createNameLabel(fontSize, entry.name);
      nameLabel.x = x + rowWidth * 0.2;
      nameLabel.y = y + rowHeight / 2;

      let scoreLabel = this.createScoreLabel(fontSize, entry.score);
      scoreLabel.x = x + rowWidth * 0.7;
      scoreLabel.y = y + rowHeight / 2;

      let changeIcon = this.createChangeIcon(iconSize, entry.change);
      changeIcon.x = x + rowWidth * 0.85;
      changeIcon.y = y + rowHeight / 2;

      let changeLabel = this.createChangeLabel(fontSize, entry.change);
      changeLabel.x = x + rowWidth * 0.93;
      changeLabel.y = y + rowHeight / 2;

      container.addChild(backgroundPanel, rankLabel, nameLabel, scoreLabel, changeIcon, changeLabel);

      if(i == 0) {
        let crownIcon = this.createCrownIcon(iconSize);
        crownIcon.x += x + rowWidth * 0.05;
        crownIcon.y += y + rowHeight / 2;
        container.addChild(crownIcon);
      }

    }

  }

  createBackgroundPanel(width, height, rank) {
    let panel = new createjs.Shape();
    panel.graphics.beginFill("#d3d3d3").drawRect(0, 0, width, height);
    panel.shadow = new createjs.Shadow("#333333", 5, 5, 10);
    switch(rank) {
      case 0:
        panel.filters = [new createjs.ColorFilter(1,1,1,1,75,75,10,0)];
        break;
      case 1:
        panel.filters = [new createjs.ColorFilter(1,1,1,1,30,30,10,0)];
        break;
      case 2:
        panel.filters = [new createjs.ColorFilter(1,1,1,1,15,15,10,0)];
        break;
    }
    panel.cache(0, 0, width, height);
    return panel;
  }

  createCrownIcon(iconSize) {
    let crownIcon = new createjs.Bitmap("img/crown.jpg");
    // Scale image
    crownIcon.image.onload = function() {
      let scale = iconSize / crownIcon.image.height;
      crownIcon.scaleX = crownIcon.scaleY = scale;
      crownIcon.x -= crownIcon.image.width * scale / 2;
      crownIcon.y -= crownIcon.image.height * scale / 2;
    };
    return crownIcon;
  }

  createRankLabel(fontSize, rank) {
    let rankLabel = new createjs.Text();
    rankLabel.text = (rank + 1) + " .";
    rankLabel.font = `${fontSize}px Dimbo`;
    rankLabel.color = "#f0261b";
    rankLabel.textAlign = "center";
    rankLabel.textBaseline = "middle";
    return rankLabel;
  }

  createNameLabel(fontSize, value) {
    let nameLabel = new createjs.Text();
    nameLabel.text = value.toString();
    nameLabel.font = `${fontSize}px Dimbo`;
    nameLabel.color = "#f0261b";
    nameLabel.textAlign = "left";
    nameLabel.textBaseline = "middle";
    return nameLabel;
  }

  createScoreLabel(fontSize, value) {
    let scoreLabel = new createjs.Text();
    scoreLabel.text = value.toString();
    scoreLabel.font = `${fontSize}px Dimbo`;
    scoreLabel.color = "#f0261b";
    scoreLabel.textAlign = "center";
    scoreLabel.textBaseline = "middle";
    return scoreLabel;
  }

  createChangeIcon(iconSize, value) {
    let changeIcon;

    if(value > 0)
      changeIcon = new createjs.Bitmap("img/rankUp.png");
    else if(value < 0)
      changeIcon = new createjs.Bitmap("img/rankDown.png");
    else
      changeIcon = new createjs.Bitmap("img/rankSame.png");

    // Scale image
    changeIcon.image.onload = function() {
      let scale = iconSize / changeIcon.image.height;
      changeIcon.scaleX = changeIcon.scaleY = scale;
      changeIcon.x -= changeIcon.image.width * scale / 2;
      changeIcon.y -= changeIcon.image.height * scale / 2;
    };
    return changeIcon;
  }

  createChangeLabel(fontSize, value) {
    let changeLabel = new createjs.Text();
    if(value > 0) value = "+" + value.toString();
    if(value == 0) value = "-";
    changeLabel.text = value;
    changeLabel.font = `${fontSize}px Dimbo`;

    if(value > 0)
      changeLabel.color = "#3bb742";
    else if(value < 0)
      changeLabel.color = "#f0261b";
    else
      changeLabel.color = "#496da3";


    changeLabel.textAlign = "center";
    changeLabel.textBaseline = "middle";
    return changeLabel;
  }

}
