class InteractiveImage {
  constructor(imagePath, submit) {
    this._imagePath = imagePath;
    this._submit = submit;
  }

  addTo(container) {
    container.name = "InteractiveImage";
    let image = this.createInteractiveImage(container);
    container.addChild(image);
  }

  createInteractiveImage(container) {
    var imageObject = new createjs.Bitmap(this._imagePath);

    let padding = container.width / 20;

    imageObject.image.onload = function() {
      // Keep aspect ratio
      let scale = Math.min((9/10 * container.width) / imageObject.image.width, (container.height / 2 + padding) / imageObject.image.height);
      imageObject.scaleX = imageObject.scaleY = scale;
      imageObject.x = - (imageObject.image.width * imageObject.scaleX) / 2;
      imageObject.y = - (imageObject.image.height * imageObject.scaleY) / 2;
    };

    imageObject.shadow = new createjs.Shadow("#333333", 5, 5, 10);

    imageObject.on("click", handleClick.bind(this));

    function handleClick(event) {
      if(this._submit != null) {
        let pin = this.createPin(container.width, container.height);
        pin.x = event.localX * imageObject.scaleX + imageObject.x;
        pin.y = event.localY * imageObject.scaleY + imageObject.y;
        container.addChild(pin);
        this._submit([Math.round(event.localX), Math.round(event.localY)]);
      }
    }

    this.preloadPinIcon();
    return imageObject;
  }

  createPin(width, height) {
    let pin = new createjs.Bitmap("img/pin.png");
    pin.image.onload = function() {
      let scale = Math.min(0.05 * width / pin.image.width, 0.05 * height / pin.image.height);
      pin.scaleX = pin.scaleY = scale;
      pin.y -= pin.image.height * scale;
    }
    return pin;
  }

  preloadPinIcon() {
    new createjs.LoadQueue().loadFile("img/pin.png");
  }
}
