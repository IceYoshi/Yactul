class AnswerButtons {
  constructor(screen, answers, callback, leftOnly, stats) {
    var numAnswers = answers.length;
    var numRows = Math.ceil(numAnswers / 2);
    var paddingX = screen.width / 30;
    var paddingY = screen.height / 50;

    var totalVoteAmount = 0;
    if(stats != undefined) {
      for(var i = 0; i<stats.length; i++) {
        totalVoteAmount += stats[i].amount;
      }
    }

    // transparent background panel for the buttons
    var answerPanel = new createjs.Shape();
    var panelWidth = screen.width - paddingX;
    var panelHeight = screen.height / 2;
    if(leftOnly) panelWidth /= 2;
    answerPanel.graphics.beginFill("#d3d3d3").drawRect(0, 0, panelWidth, panelHeight);
    answerPanel.x = paddingX / 2;
    answerPanel.y = screen.height / 2 - paddingY * 4;
    answerPanel.alpha = 0.4;
    screen.addChild(answerPanel);
    var answerObjects = [];

    for(var i = 0; i < numAnswers; i++) {
      var answer = answers[i];

      var x, y, width, height;
      if(leftOnly) {
        width = screen.width / 2 - paddingX * 1.5;
        height = screen.height / (2 * numAnswers) - paddingY - paddingY/numAnswers;
        x = paddingX;
        y = screen.height / 2 - ( paddingY * 3 ) + i * (paddingY + height);
      } else {
        width = screen.width / 2 - paddingX * 1.5;
        height = screen.height / (2 * numRows) - paddingY * 1.5;
        x = paddingX + (i % 2) * (paddingX + width);
        y = screen.height / 2 - ( paddingY * 3 ) + Math.floor(i / 2) * (paddingY + height);
      }

      // button label
      var answerLabel = new createjs.Text(answer);
      answerLabel.lineWidth = width - paddingX/2;
      answerLabel.lineHeight = height / 3;
      answerLabel.font = "26px Dimbo";
      var numAnswerLines = answerLabel.getMeasuredHeight() / answerLabel.lineHeight;
      var fontSize = Math.min(Math.floor(height / numAnswerLines), 26);
      answerLabel.font = fontSize + "px Dimbo";
      numAnswerLines = answerLabel.getMeasuredHeight() / answerLabel.lineHeight;
      answerLabel.color = "#F0261B";
      answerLabel.textAlign = "center";
      answerLabel.textBaseline = "middle";
      answerLabel.x = x + width / 2;
      answerLabel.y = y + (height / 2) - (numAnswerLines - 1) * answerLabel.lineHeight / 2;

      // button panel
      var answerRect = new createjs.Shape();
      screen.addChild(answerRect);
      if(stats != undefined && stats[i].correct) {
        answerRect.graphics.beginFill("#5cb85c");
      } else {
        answerRect.graphics.beginFill("#d3d3d3");
      }
      answerRect.graphics.drawRect(0, 0, width, height);
      answerRect.x = x;
      answerRect.y = y;
      answerRect.label = answer;
      answerRect.shadow = new createjs.Shadow("#333333", 5, 5, 10);

      answerRect.on("click", handleClick);
      answerRect.on("mouseover", handleMotion);
      answerRect.on("mouseout", handleMotion);

      answerObjects.push(answerRect);

      if(stats != undefined) {
        var statRect = new createjs.Shape();
        statRect.graphics.beginFill("#000").drawRect(0, 0, 0, height);
        statRect.x = x;
        statRect.y = y;
        statRect.alpha = 0.5;

        createjs.Tween.get(statRect.graphics.command, { loop: false })
          .wait(1000)
          .to({ w: (width * stats[i].amount / totalVoteAmount) }, 2000, createjs.Ease.getPowInOut(2));

        var statLabel = new createjs.Text(stats[i].amount);
        statLabel.font = "20px Dimbo";
        statLabel.color = "#000";
        statLabel.x = x + (width * stats[i].amount / totalVoteAmount);
        statLabel.y = y;
        statLabel.textAlign = "left";
        statLabel.textBaseline = "top";
        statLabel.alpha = 0;

        createjs.Tween.get(statLabel, { loop: false })
          .wait(2700)
          .to({ alpha: 0.8 }, 1000, createjs.Ease.getPowInOut(2));

        screen.addChild(statRect);
        screen.addChild(statLabel);

      }

      screen.addChild(answerLabel);
    }

    // click handler
    function handleClick(event) {
      if(callback != null) {
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

        var selected = [];
        for(var j = 0; j<answerObjects.length; j++) {
          if(answerObjects[j].clicked != null) {
            selected.push(answerObjects[j].label);
          }
        }
        callback(selected);
      }
    }

    // mouseover animation
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

  }

}
