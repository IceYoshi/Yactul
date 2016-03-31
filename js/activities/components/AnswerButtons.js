class AnswerButtons {
  constructor(screen, answers, callback) {
    var numAnswers = answers.length;
    var numRows = Math.ceil(numAnswers / 2);
    var paddingX = screen.width / 20;
    var paddingY = screen.height / 40;

    // transparent background panel for the buttons
    var answerPanel = new createjs.Shape();
    answerPanel.graphics.beginFill("#d3d3d3").drawRoundRect(0, 0, screen.width - paddingX, screen.height / 2, 0);
    answerPanel.x = paddingX / 2;
    answerPanel.y = screen.height / 2 - paddingY * 2.5;
    answerPanel.alpha = 0.4;
    screen.addChild(answerPanel);
    var answerObjects = [];

    for(var i = 0; i < numAnswers; i++) {
      var answer = answers[i];
      var width = screen.width / 2 - paddingX * 1.5;
      var height = screen.height / (2 * numRows) - paddingY * 1.5;
      var x = paddingX + (i % 2) * (paddingX + width);
      var y = screen.height / 2 - ( paddingY * 1.5 ) + Math.floor(i / 2) * (paddingY + height);

      // button label
      var answerLabel = new createjs.Text(answer, "bold 26px Arial", "#F0261B");
      answerLabel.lineWidth = width;
      answerLabel.textAlign = "center";
      answerLabel.x = x + width / 2;
      answerLabel.y = y + (height - answerLabel.getMeasuredHeight()) / 2;

      // button panel
      var answerRect = new createjs.Shape();
      answerRect.graphics.beginFill("#d3d3d3").drawRoundRect(0, 0, width, height, 0);
      answerRect.x = x;
      answerRect.y = y;
      answerRect.label = answer;

      answerRect.on("click", handleClick);
      answerRect.on("mouseover", handleMotion);
      answerRect.on("mouseout", handleMotion);

      answerObjects.push(answerRect);

      screen.addChild(answerRect);
      screen.addChild(answerLabel);
    }

    // click handler
    function handleClick(event) {
      if(event.target.clicked == null) {
        event.target.filters = [ new createjs.ColorFilter(0,0,0,1,255,203,151,0) ];
        event.target.clicked = 1;
      } else {
        event.target.filters = [ new createjs.ColorFilter(1,1,1,1,-25,-25,-25,0) ];
        event.target.clicked = null;
      }
      event.target.cache(0, 0, event.target.graphics.command.w, event.target.graphics.command.h);

      if(callback != null) {
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
