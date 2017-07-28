class ButtonPanel {
  constructor(values, minified, setSelected, evalData, stats) {
    this._values = values;
    this._minified = minified;
    this._setSelected = setSelected;
    this._eval = evalData;
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
      let isCorrect;
      if(this._eval) {
        isCorrect = this._eval[i].correct;
      }
      let isSelected = buttonState == undefined ? false : buttonState[i];

      let buttonPanel = this.createButtonPanel(buttonWidth, buttonHeight, this._eval ? this._eval[i].selected : false, isCorrect);
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

      if(this._eval) {
        if(this._stats) this.createStats(container, buttonPanel, this._eval[i].amount, this._eval[i].selected);
        this.createEvalIcon(container, buttonPanel, this._minified || !landscape, this._eval[i].selected, isCorrect);
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
    if(isCorrect == undefined) {
      buttonPanel.graphics.beginRadialGradientFill(["#ededed", "#c6c6c6"], [0, 1], width * 0.4, 0, 0, 0, 0, width);
    } else {
      if(isCorrect) {
        if(isSelected) {
          buttonPanel.graphics.beginRadialGradientFill(["#6ec06e", "#4cae4c"], [0, 1], width * 0.4, 0, 0, 0, 0, width);
        } else {
          buttonPanel.graphics.beginRadialGradientFill(["#ededed", "#c6c6c6"], [0, 1], width * 0.4, 0, 0, 0, 0, width);
          buttonPanel.filters = [ new createjs.ColorFilter(1,1,1,1) ];
          buttonPanel.cache(0, 0, width, height);
          buttonPanel.handleEvent = function() {
            this.updateCache();
          };
          createjs.Ticker.addEventListener("tick", buttonPanel);
          createjs.Tween.get(buttonPanel, { loop: true })
            .wait(200)
            .call(function(filter) {
              createjs.Tween.get(filter, { loop: false })
                .to({ redMultiplier: 0.43, greenMultiplier: 0.75, blueMultiplier: 0.43 }, 400, createjs.Ease.getPowInOut(2))
                .to({ redMultiplier: 1, greenMultiplier: 1, blueMultiplier: 1 }, 400, createjs.Ease.getPowInOut(2));
            }, [buttonPanel.filters[0]])
            .wait(800);
        }
      } else {
        if(isSelected) {
          buttonPanel.graphics.beginRadialGradientFill(["#f78c86", "#f35e56"], [0, 1], width * 0.4, 0, 0, 0, 0, width);
        } else {
          buttonPanel.graphics.beginRadialGradientFill(["#ededed", "#c6c6c6"], [0, 1], width * 0.4, 0, 0, 0, 0, width);
        }
      }
    }
    buttonPanel.graphics.drawRect(0, 0, width, height);
    buttonPanel.width = width;
    buttonPanel.height = height;
    buttonPanel.shadow = new createjs.Shadow("#333333", 5, 5, 10);

    if(this._setSelected != null) {
      buttonPanel.on("click", handleClick.bind(this));
      buttonPanel.on("mouseover", handleMotion.bind(this));
      buttonPanel.on("mouseout", handleMotion.bind(this));
    }

    // button click handler
    function handleClick(event) {
      if(event.target.clicked == null) {
        event.target.filters = [ new createjs.ColorFilter(1,0.62,0.24,1,0,0,0,0) ];
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
    label.text = Common.decodeHtml(value.toString());
    label.font = `${fontSize}px Dimbo`;
    label.lineWidth = width;
    label.lineHeight = fontSize * 1.5;
    label.color = "black";
    label.textAlign = "center";
    label.textBaseline = "middle";

    while(label.getMeasuredHeight() > height) {
      fontSize -= 2;
      label.lineHeight = fontSize * 1.5;
      label.font = `${fontSize}px Dimbo`;
    }

    return label;
  }

  createEvalIcon(container, buttonPanel, isMinimized, isSelected, isCorrect) {
    if(isSelected || isCorrect) {
      let padding = buttonPanel.height / 10;
      let icon = new createjs.Bitmap(isCorrect ? "img/correct.png" : "img/wrong.png");
      icon.image.onload = function() {
        let iconSize = buttonPanel.height * ( isMinimized ? 0.5 : 0.3 );
        let scale = iconSize / icon.image.height;
        icon.scaleX = icon.scaleY = scale;
        icon.x = buttonPanel.x + buttonPanel.width - icon.image.width * scale - padding;
        icon.y = buttonPanel.y + padding;
        container.addChild(icon);
      };
    }
  }

  createStats(container, buttonPanel, voteCount, isSelected) {
    let totalVoteCount = 0;
    for(let i = 0; i < this._eval.length; i++) {
      totalVoteCount += this._eval[i].amount;
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
    statLabel.color = "#FFF";
    statLabel.textAlign = "right";
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
