class BackgroundImage {
  constructor(imagePath) {
    this._imagePath = imagePath;
  }

  addTo(container) {
    container.name = "BackgroundImage";
    this.createBackgroundImage(container.width, container.height, this._imagePath, container);
  }

  createBackgroundImage(w, h, imagePath, container) {
    let bg = new createjs.Bitmap(imagePath);

    // Resize image to fill screen
    bg.image.onload = function() {
      bg.scaleX = w / bg.image.width;
      bg.scaleY = h / bg.image.height;
      container.addChild(bg);
    }.bind(this);
  }
}
