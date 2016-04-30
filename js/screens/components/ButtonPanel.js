class ButtonPanel {
  constructor(values, minified, setSelected, stats) {
    this._values = values;
    this._minified = minified;
    this._setSelected = setSelected;
    this._stats = stats;
    this._buttons = [];
    this._initialized = false;
  }

  addTo(container) {
    container.name = "ButtonPanel";
    let landscape = container.width >= container.height;

    let width = container.width;
    if(this._minified && landscape) width /= 2;

    let height = container.height / 2;
    if(this._minified && !landscape) height *= 0.7;

    let paddingX = container.width / 60;
    let paddingY = container.height / 50;

    let buttonCount = this._values.length;
    let colCount = this._minified || !landscape ? 1 : 2;
    let rowCount = Math.ceil(buttonCount / colCount);
    let buttonWidth = (width - (paddingX * (colCount + 3))) / colCount;
    let buttonHeight = (height - (paddingY * (rowCount + 3))) / rowCount;

    let masterPanel = this.createMasterPanel(width - paddingX * 2, height - paddingY * 2);
    container.addChild(masterPanel);

    if(this._buttons.length > 0) {
      var buttonState = [];
      for(let i = 0; i < this._buttons.length; i++) {
        buttonState.push(this._buttons[i].clicked != null);
      }
      this._buttons = [];
    }

    for(let i = 0; i < buttonCount; i++) {
      let value = this._values[i];
      let col = i % colCount;
      let row = Math.floor(i / colCount);
      let isCorrect = this._stats != undefined && this._stats[i].correct;
      let isSelected = buttonState == undefined ? false : buttonState[i];

      let buttonPanel = this.createButtonPanel(buttonWidth, buttonHeight, isSelected, isCorrect);
      buttonPanel.x = paddingX + col * (paddingX + buttonWidth) + masterPanel.x;
      buttonPanel.y = paddingY + row * (paddingY + buttonHeight) + masterPanel.y;
      buttonPanel.label = value.toString();
      this._buttons.push(buttonPanel);
      if(isSelected) buttonPanel.dispatchEvent("click");

      let buttonLabel = this.createButtonLabel(buttonWidth - paddingX, buttonHeight, value);
      buttonLabel.x = buttonPanel.x + buttonWidth / 2;
      let lineCount = buttonLabel.getMeasuredHeight() / buttonLabel.lineHeight;
      buttonLabel.y = buttonPanel.y + buttonHeight / 2 - (lineCount - 1) * buttonLabel.lineHeight / 2;
      container.addChild(buttonPanel, buttonLabel);

      if(this._stats != undefined) {
        this.createStats(container, buttonPanel, this._stats[i].amount);
      }
    }

    this._initialized = true;
  }

  createMasterPanel(width, height) {
    let masterPanel = new createjs.Shape();
    masterPanel.graphics.beginFill("#d3d3d3").drawRect(0, 0, width, height);
    masterPanel.x = -width / 2;
    masterPanel.y = -height / 2;
    masterPanel.alpha = 0.4;
    return masterPanel;
  }

  createButtonPanel(width, height, isSelected, isCorrect) {
    let buttonPanel = new createjs.Shape();

    if(isCorrect) {
      buttonPanel.graphics.beginFill("#5cb85c");
    } else {
      buttonPanel.graphics.beginFill("#d3d3d3");
    }

    buttonPanel.graphics.drawRect(0, 0, width, height);
    buttonPanel.width = width;
    buttonPanel.height = height;
    buttonPanel.shadow = new createjs.Shadow("#333333", 5, 5, 10);

    buttonPanel.on("click", handleClick.bind(this));
    buttonPanel.on("mouseover", handleMotion.bind(this));
    buttonPanel.on("mouseout", handleMotion.bind(this));

    // button click handler
    function handleClick(event) {
      if(this._setSelected != null) {
        if(event.target.clicked == null) {
          event.target.filters = [ new createjs.ColorFilter(0,0,0,1,255,203,151,0) ];
          event.target.clicked = 1;
        } else {
          if(event.isTouch) {
            event.target.filters = [ new createjs.ColorFilter(1,1,1,1,0,0,0,0) ];
          } else {
            event.target.filters = [ new createjs.ColorFilter(1,1,1,1,-25,-25,-25,0) ];
          }
          event.target.clicked = null;
        }
        event.target.cache(0, 0, event.target.graphics.command.w, event.target.graphics.command.h);

        let selected = [];
        for(let i = 0; i<this._buttons.length; i++) {
          if(this._buttons[i].clicked != null) {
            selected.push(this._buttons[i].label);
          }
        }
        this._setSelected(selected);
      }
    }

    // button mouseover animation
    function handleMotion(event) {
      if(event.target.clicked == null) {
        switch(event.type) {
          case "mouseover":
            // r, g, b, a - multiply old values, then add offset to them
            event.target.filters = [ new createjs.ColorFilter(1,1,1,1,-25,-25,-25,0) ];
            break;
          case "mouseout":
            event.target.filters = [ new createjs.ColorFilter(1,1,1,1,0,0,0,0) ];
            break;
        }
        event.target.cache(0, 0, event.target.graphics.command.w, event.target.graphics.command.h);
      }
    }

    return buttonPanel;
  }

  createButtonLabel(width, height, value) {
    let fontSize = 40;
    let label = new createjs.Text();
    label.text = value.toString();
    label.font = `${fontSize}px Dimbo`;
    label.lineWidth = width;
    label.lineHeight = fontSize * 1.5;
    label.color = "#F0261B";
    label.textAlign = "center";
    label.textBaseline = "middle";

    while(label.getMeasuredHeight() > height) {
      fontSize -= 2;
      label.lineHeight = fontSize * 1.5;
      label.font = `${fontSize}px Dimbo`;
    }

    return label;
  }

  createStats(container, buttonPanel, voteCount) {
    let totalVoteCount = 0;
    for(let i = 0; i < this._stats.length; i++) {
      totalVoteCount += this._stats[i].amount;
    }

    let statBar = this.createStatBar(buttonPanel.height);
    statBar.x = buttonPanel.x;
    statBar.y = buttonPanel.y;
    this.animateStatBar(statBar, buttonPanel.width, voteCount, totalVoteCount, this._initialized);

    let statLabel = this.createStatLabel(container.width, container.height, voteCount);
    statLabel.x = buttonPanel.x + (buttonPanel.width * voteCount / totalVoteCount);
    statLabel.y = buttonPanel.y;
    this.animateStatLabel(statLabel, this._initialized);
    container.addChild(statBar, statLabel);
  }

  createStatBar(height) {
    let statBar = new createjs.Shape();
    statBar.graphics.beginFill("#000").drawRect(0, 0, 0, height);
    statBar.alpha = 0.5;
    return statBar;
  }

  animateStatBar(statBar, width, voteCount, totalVoteCount, skipAnimation) {
    createjs.Tween.get(statBar.graphics.command, { loop: false })
      .wait(skipAnimation ? 0 : 1000)
      .to({ w: (width * voteCount / totalVoteCount) }, skipAnimation ? 0 : 2000, createjs.Ease.getPowInOut(2));
  }

  createStatLabel(width, height, voteCount) {
    let fontSize = Math.floor(Math.max(width / 40, height / 30));
    let statLabel = new createjs.Text(voteCount.toString());
    statLabel.font = `${fontSize}px Dimbo`;
    statLabel.color = "#000";
    statLabel.textAlign = "left";
    statLabel.textBaseline = "top";
    statLabel.alpha = 0;
    return statLabel;
  }

  animateStatLabel(statLabel, skipAnimation) {
    createjs.Tween.get(statLabel, { loop: false })
      .wait(skipAnimation ? 0 : 2700)
      .to({ alpha: 0.8 }, skipAnimation ? 0 : 1000, createjs.Ease.getPowInOut(2));
  }


}
