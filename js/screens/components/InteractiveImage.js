class InteractiveImage {
  constructor(imagePath, submit, stats) {
    this._imagePath = imagePath;
    this._submit = submit;
    this._stats = stats;
    this._initialized = false;
  }

  addTo(container) {
    this._container = container;
    container.name = "InteractiveImage";
    this.createInteractiveImage(container);
    this.preloadPinIcon();
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
      this._container.addChild(imageObject);
      if(this._stats != undefined) {
        this.createStats(this._stats, imageObject);
        this._initialized = true;
      }
    }.bind(this);

    imageObject.shadow = new createjs.Shadow("#333333", 5, 5, 10);

    imageObject.on("click", handleClick.bind(this));

    function handleClick(event) {
      if(this._submit != null || event.isAnswer) {
        let pin = this.createPin(container.width, container.height);
        pin.x = event.localX * imageObject.scaleX + imageObject.x;
        pin.y = event.localY * imageObject.scaleY + imageObject.y;

        if(event.selected) {
          pin.filters = [ new createjs.ColorFilter(0,0,0,1,255,99,71,0) ];
        }
        if(event.isAnswer) {
          pin.alpha = 0;
          let x = pin.x;
          let y = pin.y;
          pin.x += 50;
          pin.y -= 50;
          pin.alpha = 0;

          let waitTime = Math.round(Math.random() * 300);
          if(!this._initialized) waitTime += 1000;

          createjs.Tween.get(pin, { loop: false })
            .wait(waitTime)
            .to({ x:x, y:y, alpha:1}, 300, createjs.Ease.getPowInOut(2));
        }
        if(this._submit != null)
          this._submit([Math.round(event.localX), Math.round(event.localY)]);
      }
    }
  }

  createPin(width, height) {
    let pin = new createjs.Bitmap("img/pin.png");
    pin.image.onload = function() {
      let scale = Math.min(0.05 * width / pin.image.width, 0.05 * height / pin.image.height);
      pin.scaleX = pin.scaleY = scale;
      pin.y -= pin.image.height * scale;
      pin.cache(0, 0, pin.image.width, pin.image.height);
      this._container.addChild(pin);
    }.bind(this);
    return pin;
  }

  preloadPinIcon() {
    new createjs.LoadQueue().loadFile("img/pin.png");
  }

  createStats(stats, image) {
    let area = stats.correct;
    this.createCorrectArea(area.type, area.data, image);

    let points = stats.answers;
    for(let i = 0; i < points.length; i++) {
      let event = new createjs.Event("click");
      event.localX = points[i].x;
      event.localY = points[i].y;
      event.selected = points[i].selected;
      event.isAnswer = true;
      image.dispatchEvent(event);
    }
  }

  createCorrectArea(type, data, image) {
    let area = new createjs.Shape();
    switch(type) {
      case "polygon":
        area.graphics.beginFill("green");
        area.graphics.moveTo(this.convertLocalToAbsoluteX(data[0].x, image), this.convertLocalToAbsoluteY(data[0].y, image));
        for(let i = 1; i < data.length; i++) {
          area.graphics.lineTo(this.convertLocalToAbsoluteX(data[i].x, image), this.convertLocalToAbsoluteY(data[i].y, image));
        }
        area.graphics.lineTo(this.convertLocalToAbsoluteX(data[data.length - 1].x, image), this.convertLocalToAbsoluteY(data[data.length - 1].y, image));
        area.graphics.endFill();
        break;
      case "circle":
        let radius = Math.round(Math.sqrt(Math.pow(data.center.x - data.radius.x, 2) + Math.pow(data.center.y - data.radius.y, 2)) * image.scaleX);
        area.graphics.beginFill("green")
          .drawCircle(this.convertLocalToAbsoluteX(data.center.x, image), this.convertLocalToAbsoluteY(data.center.y, image),
          radius);
        break;
    }
    area.alpha = 0.7;
    this._container.addChild(area);
  }

  convertLocalToAbsoluteX(value, imageObject) {
    return value * imageObject.scaleX + imageObject.x;
  }

  convertLocalToAbsoluteY(value, imageObject) {
    return value * imageObject.scaleY + imageObject.y;
  }
}
