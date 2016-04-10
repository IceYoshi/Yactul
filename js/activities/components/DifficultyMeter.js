class DifficultyMeter {
  constructor(screen, value) {
    var maxDifficulty = 5;
    value = Math.min(value, maxDifficulty);

    var paddingTop = screen.height / 20;
    var paddingBetween = screen.width / 30;

    for(var i = 0; i < maxDifficulty; i++) {
      var star = new createjs.Shape();
      if(value > i) {
        star.graphics.beginFill("#F0261B");
      } else {
        star.graphics.beginFill("#333333");
      }

      star.graphics.drawPolyStar(0, 0, 10, 5, 0.6, -90);
      star.x = screen.width / 2 - ((maxDifficulty/2 - i) * paddingBetween) + paddingBetween/2;
      star.y = paddingTop;
      screen.addChild(star);
    }

  }
}
