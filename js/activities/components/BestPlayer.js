class BestPlayer {
  constructor(screen, text) {
    var bestLabel = new createjs.Text(text, "25px Dimbo", "#F0261B");
    bestLabel.x = screen.width / 2;
    bestLabel.y = screen.height;
    bestLabel.textAlign = "center";
    bestLabel.textBaseline = "bottom";

    screen.addChild(bestLabel);
  }

}
