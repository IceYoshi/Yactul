class MovingPlatform {
  constructor() {
    this._lastKeyPressed = null;
  }

  addTo(container) {
    container.name = "MovingPlatform";

    this._width = container.width;
    this._height = container.height;

    let platform = this.createPlatform(Math.max(container.width, container.height) / 6, container.height / 20, "img/basket.png", container);
    platform.x += container.width * 0.5;
    platform.y += container.height * 0.85;
    this._platform = platform;

    this.createPlatformControls(platform, container);
  }

  createPlatform(width, height, imagePath, container) {
    var imageObject = new createjs.Bitmap(imagePath);

    imageObject.image.onload = function() {
      let scale = width / imageObject.image.width;
      imageObject.scaleX = imageObject.scaleY = scale;
      imageObject.x -= (imageObject.image.width * imageObject.scaleX) / 2;
      imageObject.regX = imageObject.image.width / 2;
      container.addChild(imageObject);
    };

    imageObject.width = width;
    imageObject.height = height;

    return imageObject;
  }

  createPlatformControls(platform, container) {
    let velocity = 1500; // time in ms to travel the width of the container
    window.onkeydown = function(event) {
      let keyPressed = event.key;
      this._lastKeyPressed = keyPressed;
      if(keyPressed === "a" || keyPressed === "A" || keyPressed === "ArrowLeft" || keyPressed === "Left") {
        this.movePlatform(platform, 0); // <--
      } else if(keyPressed === "d" || keyPressed === "D" || keyPressed === "ArrowRight" || keyPressed === "Right") {
        this.movePlatform(platform, this._width); // -->
      }
    }.bind(this);
    window.onkeyup = function(event) {
      if(this._lastKeyPressed === event.key)
        this.stopPlatform(platform);
    }.bind(this);

    this.createHitArea(container);

    container.on("mousedown", function(event) {
      this._lastKeyPressed = "MouseClick";
      this.movePlatform(platform, event.rawX);
    }.bind(this));

    container.on("pressmove", function(event) {
      this._lastKeyPressed = "MouseClick";
      this.movePlatform(platform, event.rawX);
    }.bind(this));

    container.on("pressup", function(event) {
      if(this._lastKeyPressed === "MouseClick")
        this.stopPlatform(platform);
    }.bind(this));
  }

  createHitArea(container) {
    let area = new createjs.Shape();
    area.graphics.beginFill("#000").drawRect(0, 0, container.width, container.height);
    container.hitArea = area;
  }


  movePlatform(platform, xPos) {
    xPos = Math.max(Math.min(xPos, this._width - platform.width / 2), platform.width / 2);

    let velocity = 1500; // time in ms to travel the width of the container

    if(platform.x > xPos) {  // moving left
      if(platform.scaleX > 0) {
        platform.scaleX *= -1;
      }
      createjs.Tween.get(platform, { loop: false, override: true })
        .to({ x: xPos }, velocity * (platform.x - xPos) / this._width, createjs.Ease.getPowInOut(1));
    } else if(platform.x < xPos) {  // moving right
      if(platform.scaleX < 0) {
        platform.scaleX *= -1;
      }
      createjs.Tween.get(platform, { loop: false, override: true })
        .to({ x: xPos }, velocity * (xPos - platform.x) / this._width, createjs.Ease.getPowInOut(1));
    }
  }

  stopPlatform(platform) {
    createjs.Tween.removeTweens(platform);
  }

  hitTestBetween(xPosLeft, xPosRight) {
    if(this.hitTest(xPosLeft) || this.hitTest(xPosRight) || (xPosLeft < this._platform.x && xPosRight > this._platform.x + this._platform.width))
      return true;
    return false;
  }

  hitTest(xPos) {
    if(Math.abs(this._platform.x - xPos) <= this._platform.width/2)
      return true;
    return false;
  }
}
