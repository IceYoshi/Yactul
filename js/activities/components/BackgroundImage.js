class BackgroundImage {
  constructor(screen, imagePath) {
    var bg = new createjs.Bitmap(imagePath);

    // Resize image to full screen
    bg.image.onload = function() {
      bg.scaleX = screen.width / bg.image.width;
      bg.scaleY = screen.height / bg.image.height;
    };

    // Add image at layer 0 (behind other objects)
    screen.addChildAt(bg, 0);
  }
}
