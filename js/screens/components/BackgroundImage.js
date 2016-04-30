class BackgroundImage {
  constructor(imagePath) {
    this._imagePath = imagePath;
  }

  addTo(container) {
    container.name = "BackgroundImage";
    let backgroundImage = this.createBackgroundImage(container.width, container.height, this._imagePath);
    container.addChild(backgroundImage);
  }

  createBackgroundImage(w, h, imagePath) {
    let bg = new createjs.Bitmap(imagePath);

    // Resize image to full screen
    bg.image.onload = function() {
      bg.scaleX = w / bg.image.width;
      bg.scaleY = h / bg.image.height;
    };

    return bg;
  }
}
