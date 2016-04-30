class DisplayImage {
  constructor(imagePath) {
    this._imagePath = imagePath;
  }

  addTo(container) {
    container.name = "DisplayImage";
    let image = this.createImageObject(container.width, container.height, this._imagePath);
    container.addChild(image);
  }

  createImageObject(width, height, imagePath) {
    var imageObject = new createjs.Bitmap(imagePath);
    let landscape = width >= height;

    imageObject.image.onload = function() {
      // Keep aspect ratio
      let scale = Math.min(0.4 * width / imageObject.image.width, 0.5 * height / imageObject.image.height);
      if(!landscape) scale *= 0.9;
      imageObject.scaleX = imageObject.scaleY = scale;
      imageObject.x = - (imageObject.image.width * imageObject.scaleX) / 2;
      imageObject.y = - (imageObject.image.height * imageObject.scaleY) / 2;
    };

    imageObject.shadow = new createjs.Shadow("#333333", 5, 5, 10);

    return imageObject;
  }


}
