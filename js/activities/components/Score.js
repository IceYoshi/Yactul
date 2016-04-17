class Score {
  constructor(screen, value) {
    var scoreLabel = new createjs.Text(value.toString(), "30px Dimbo", "#F0261B");
    scoreLabel.x = 0;
    scoreLabel.y = 0;
    scoreLabel.textAlign = "left";
    scoreLabel.textBaseline = "top";

    var scoreRect = new createjs.Shape();
    scoreRect.graphics.beginFill("#d3d3d3").drawRoundRectComplex(0, 0,
      scoreLabel.getMeasuredWidth() + scoreLabel.getMeasuredHeight() / 2, 3/2 * scoreLabel.getMeasuredHeight(),
       0, 0, scoreLabel.getMeasuredHeight(), 0);
    scoreRect.x = 0;
    scoreRect.y = 0;

    screen.addChild(scoreRect);
    screen.addChild(scoreLabel);
  }

}
