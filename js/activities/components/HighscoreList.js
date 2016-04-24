class HighscoreList {
  constructor(screen, ranklist) {
    var itemCount = Math.min(ranklist.length, 5);
    var paddingTop = screen.height / 2.5;
    var paddingLeft = screen.width / 6;
    var paddingBetween = screen.height / 9;
    var baseSize = 45;

    for(var i = 0; i < itemCount; i++) {
      var lineHeight = paddingTop + i * paddingBetween;
      var item = ranklist[i];


      var rankLabel = new createjs.Text();
      rankLabel.text = (i + 1) + " .";
      rankLabel.font = baseSize - 10 * Math.min(i, 2.5) + "px Dimbo";
      rankLabel.color = "#F0261B";
      rankLabel.textBaseline = "alphabetic";
      rankLabel.x = paddingLeft;
      rankLabel.y = lineHeight;
      rankLabel.lineWidth = screen.width / 3;
      rankLabel.textAlign = "center";
      rankLabel.textBaseline = "middle";


      var nameLabel = new createjs.Text();
      nameLabel.text = item.name;
      nameLabel.font = baseSize - 10 * Math.min(i, 2.5) + "px Dimbo";
      nameLabel.color = "#F0261B";
      nameLabel.textBaseline = "alphabetic";
      nameLabel.x = paddingLeft + screen.width / 10;
      nameLabel.y = lineHeight;
      nameLabel.lineWidth = screen.width / 3;
      nameLabel.textBaseline = "middle";


      var scoreLabel = new createjs.Text();
      scoreLabel.text = item.score;
      scoreLabel.font = baseSize - 10 * Math.min(i, 2.5) + "px Dimbo";
      scoreLabel.color = "#F0261B";
      scoreLabel.textBaseline = "alphabetic";
      scoreLabel.x = paddingLeft + screen.width / 2;
      scoreLabel.y = lineHeight;
      scoreLabel.lineWidth = screen.width / 3;
      scoreLabel.textAlign = "center";
      scoreLabel.textBaseline = "middle";


      var differenceLabel = new createjs.Text();
      var difference = i == 0 ? 0 : -(ranklist[i - 1].score - item.score);
      differenceLabel.text = difference;
      differenceLabel.font = "italic " + (baseSize - 5 - 10 * Math.min(i, 2.5)) + "px Dimbo";
      differenceLabel.color = "#F0261B";
      differenceLabel.textBaseline = "alphabetic";
      differenceLabel.x = paddingLeft + screen.width / 1.5;
      differenceLabel.y = lineHeight;
      differenceLabel.lineWidth = screen.width / 3;
      differenceLabel.textAlign = "center";
      differenceLabel.textBaseline = "middle";

      var backgroundPanel = new createjs.Shape();
      backgroundPanel.graphics.beginFill("#d3d3d3").drawRect(0, 0, screen.width * 0.9, paddingBetween);
      backgroundPanel.x = screen.width * 0.05;
      backgroundPanel.y = lineHeight - paddingBetween / 2.2;
      backgroundPanel.shadow = new createjs.Shadow("#333333", 5, 5, 10);
      switch(i) {
        case 0:
          backgroundPanel.filters = [new createjs.ColorFilter(1,1,1,1,75,75,10,0)];
          break;
        case 1:
          backgroundPanel.filters = [new createjs.ColorFilter(1,1,1,1,30,30,10,0)];
          break;
        case 2:
          backgroundPanel.filters = [new createjs.ColorFilter(1,1,1,1,15,15,10,0)];
          break;
      }

      backgroundPanel.cache(0, 0, screen.width * 0.9, paddingBetween);

      screen.addChild(backgroundPanel);
      screen.addChild(rankLabel);
      screen.addChild(nameLabel);
      screen.addChild(scoreLabel);
      screen.addChild(differenceLabel);

      if(i == 0) {
        var crown = new createjs.Bitmap("img/crown.jpg");

        // Resize image
        crown.image.onload = function() {
          crown.scaleX = crown.scaleY = (screen.width / 30) / crown.image.width;
          crown.x = paddingLeft * 0.5;
          crown.y = paddingTop - crown.image.height * crown.scaleY / 2;
        };

        screen.addChild(crown);
      }
    }
  }

}
