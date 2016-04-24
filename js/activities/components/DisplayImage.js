class DisplayImage {
  constructor(screen, imagePath) {
    if(imagePath != undefined) {
      var bg = new createjs.Bitmap(imagePath);

      bg.image.onload = function() {
        // Keep aspect ratio
        var scale = Math.min((2/5 * screen.width) / bg.image.width, (screen.height / 2) / bg.image.height);
        bg.scaleX = bg.scaleY = scale;
        bg.x = 3/4 * screen.width - (bg.image.width * bg.scaleX) / 2;
        bg.y = 2/3 * screen.height - (bg.image.height * bg.scaleY) / 2;
      };

      bg.shadow = new createjs.Shadow("#333333", 5, 5, 10);

      // Add image at layer 0 (behind other objects)
      screen.addChild(bg);
    }
  }
}
