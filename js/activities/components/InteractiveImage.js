class InteractiveImage {
  constructor(screen, imagePath, callback) {
    var bg = new createjs.Bitmap(imagePath);

    var padding = screen.width / 20;

    //bg.x = padding;
    bg.y = screen.height / 2 - 2*padding;

    bg.image.onload = function() {
      // Keep aspect ratio
      var scale = Math.min((9/10 * screen.width) / bg.image.width, (screen.height / 2 + padding) / bg.image.height);
      bg.scaleX = scale;
      bg.scaleY = scale;
      bg.x = (screen.width - bg.image.width * bg.scaleX) / 2;
    };

    bg.shadow = new createjs.Shadow("#333333", 5, 5, 10);

    bg.on("click", handleClick);

    function handleClick(event) {
      if(callback != null) {
        var star = new createjs.Shape();
        star.graphics.beginFill("#000000").drawPolyStar(0, 0, 10, 5, 0.6, -90);
        star.x = event.stageX / screen.stage.scaleX;
        star.y = event.stageY / screen.stage.scaleY;
        screen.addChild(star);
        callback([Math.round(event.localX), Math.round(event.localY)])
      }
    }

    // Add background image at layer 0 (behind other objects)
    screen.addChild(bg);
  }
}
