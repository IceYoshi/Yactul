class RaceProgressionDisplay {
  constructor(groups, numSteps) {
    this._spriteWidth = 400;
    this._spriteHeight = 248;

    let spriteData = {
			images: ["img/spritesheet_horse.png"],
			frames: {
        width: this._spriteWidth,
        height: this._spriteHeight,
        regX: Math.round(this._spriteWidth / 2),
        regY: Math.round(this._spriteHeight / 2)
      }
		};

    this._sprite = new createjs.Sprite(new createjs.SpriteSheet(spriteData));
    this._sprite.gotoAndStop(7);

    this._groups = groups;
    this._numSteps = numSteps;
  }

  addTo(container) {
    this._container = container;
    container.name = "RaceProgressionDisplay";

    let groupCount = this._groups.length;
    let rowWidth = container.width * 0.7;
    let rowHeight = container.height / (2 * groupCount);
    let padding = container.width / 10;
    this._stepWidth = rowWidth / this._numSteps;

    this._horseSprites = [];
    this._rankCounter = 1;

    for(let i = 0; i < groupCount; i++) {
      let groupLabel = this.createLabel(this._groups[i].name, rowWidth);
      groupLabel.x = -rowWidth / 2 + padding * 0.9;
      groupLabel.y = rowHeight * (i + 1/2);

      let progressBar = this.createProgressBar(this._groups[i].position, this._numSteps, this._groups[i].color, rowWidth, rowHeight);
      progressBar.x = -rowWidth / 2 + padding;
      progressBar.y = rowHeight * i;

      container.addChild(progressBar, groupLabel);
    }

    for(let i = 1; i < this._numSteps; i++) {
      let x = -rowWidth / 2 + padding + i * this._stepWidth;
      container.addChild(this.createStepDivisor(x, rowHeight * groupCount));
    }

    for(let i = 0; i < groupCount; i++) {
      let horseSprite = this.createHorseSprite();
      horseSprite.x = -rowWidth / 2 + this._groups[i].position * this._stepWidth + this._stepWidth / 2 + padding;
      horseSprite.y = rowHeight * (i + 1/2);
      horseSprite.scaleX = horseSprite.scaleY = (rowHeight * 3/5) / this._spriteHeight;
      horseSprite.position = this._groups[i].position
      container.addChild(horseSprite);
      this._horseSprites[this._groups[i].name] = horseSprite;

      if(horseSprite.position >= this._numSteps - 1)
        this.createRankLabel(i);
    }

  }

  createStepDivisor(x, height) {
    let line = new createjs.Shape();
    line.graphics.setStrokeStyle(3).beginStroke("black")
      .moveTo(x, 0)
      .lineTo(x, height)
      .endStroke();
    line.alpha = 0.5;
    return line;
  }

  createLabel(value, width) {
    let fontSize = width / 20;
    let groupLabel = new createjs.Text();
    groupLabel.text = value.toString();
    groupLabel.font = `${fontSize}px Dimbo`;
    groupLabel.color = "#000";
    groupLabel.textAlign = "right";
    groupLabel.textBaseline = "middle";
    return groupLabel;
  }

  createProgressBar(position, steps, color, width, height) {
    let bar = new createjs.Shape();
    bar.graphics.beginFill(color).drawRect(0, 0, width, height);
    bar.shadow = new createjs.Shadow("#333333", 5, 5, 10);
    return bar;
  }

  createHorseSprite() {
    return this._sprite.clone();
  }

  update(group, value) {
    let horseSprite = this._horseSprites[group];
    if(!horseSprite) {
      console.log(`Group ${group} not found.`);
      return false;
    }
    if(horseSprite.position + value >= 0 && horseSprite.position < this._numSteps - 1) {
      let oldPosition = horseSprite.position;
      horseSprite.position = Math.max(Math.min(horseSprite.position + value, this._numSteps - 1), 0);
      let deltaPosition = horseSprite.position - oldPosition;
      createjs.Tween.get(horseSprite, { loop: false })
        .call(horseSprite.play)
        .to( { x: horseSprite.x + deltaPosition * this._stepWidth }, 1000 * Math.abs(deltaPosition))
        .call(horseSprite.gotoAndStop, [7]);

      for(let i = this._groups.length - 1; i >= 0 ; i--) {
        if(this._groups[i].name === group) {
          this._groups[i].position += deltaPosition;

          if(this._groups[i].position == this._numSteps - 1) {
            this.createRankLabel(i);
          }

          break;
        }
      }
      return true;
    }
    return false;
  }

  createRankLabel(i) {
    let rank;
    if(!this._groups[i].rank) {
      rank = this._rankCounter;
      this._groups[i].rank = rank;
    } else {
      rank = this._groups[i].rank;
      this._rankCounter = Math.max(this._rankCounter, rank);
    }

    let fontSize = this._container.width / 30;
    let rankLabel = new createjs.Text();
    rankLabel.text = rank.toString() + ". ";
    rankLabel.font = `${fontSize}px Dimbo`;
    rankLabel.color = "#f0261b";
    rankLabel.textAlign = "right";
    rankLabel.textBaseline = "middle";
    rankLabel.x = this._container.width / 2;
    rankLabel.y = this._container.height / (2 * this._groups.length) * (i + 1/2);
    this._rankCounter ++;
    this._container.addChild(rankLabel);

  }
}
