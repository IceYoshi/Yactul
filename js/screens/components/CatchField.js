class CatchField {
  constructor(wordPool, velocity, hitTest) {
    this._wordPool = wordPool
    this._velocity = 10000 / velocity;
    this._hitTest = hitTest;
    this._running = false;
    this._interval = 6000 / velocity;
    this._dummy = new createjs.Shape();
    this._dummy.persistant = true;
    this._apples = [];
  }

  addTo(container) {
    container.name = "CatchField";
    this._container = container;

    if(!this._running) {
      this._running = true;
      this.tick(this._dummy);
    } else {
      let apples = this._apples;
      for(let i = 0; i < apples.length; i++) {
        let apple = apples[i];
        apple.x *= container.width / this._width;
        container.addChild(apple);
      }
    }

    this._width = container.width;

    container.addChild(this._dummy);

  }

  tick(dummy) {
    createjs.Tween.get(dummy, { loop: true })
      .wait(this._interval)
      .call(function() {
        let container = this._container;
        let apple = this.createApple(this.getRandomWord(), container.width, Math.max(container.width, container.height));
        this.animateApple(container, apple, container.height*0.85 - this._appleSize / 2, this._velocity);
        this._apples.push(apple);
        container.addChild(apple);
      }.bind(this));
  }

  createApple(label, width, size) {
    this._appleSize = size / 6;
    let apple = new createjs.Container();
    apple.addChild(this.createAppleSprite(this._appleSize));
    apple.addChild(this.createAppleLabel(size / 12, label));
    apple.x = Common.getRandomNumber(this._appleSize / 2, width - this._appleSize / 2);
    apple.y = -this._appleSize;
    apple.width = this._appleSize;
    apple.text = label.toString();
    return apple;
  }

  getRandomWord() {
    return this._wordPool[Common.getRandomNumber(0, this._wordPool.length - 1)];
  }

  animateApple(container, apple, height, velocity) {
    apple.persistant = true;
    createjs.Tween.get(apple, { loop: false })
      .to( { y: height }, velocity)
      .call(function(event) {
        if(this._hitTest(apple)) {
          // Hit!
          createjs.Tween.get(apple, { loop: false })
            .to( { rotation: 360, alpha: 0, scaleX: 0, scaleY: 0, y: apple.y + this._appleSize / 2 }, 500)
            .call(function(event) {
              this._apples.splice(this._apples.indexOf(apple), 1);
              container.removeChild(apple);
            }.bind(this));
        } else {
          // Miss!
          createjs.Tween.get(apple, { loop: false })
            .to( { y: apple.y + container.height }, velocity)
            .call(function(event) {
              this._apples.splice(this._apples.indexOf(apple), 1);
              container.removeChild(apple);
            }.bind(this));
        }
      }.bind(this));
  }

  createAppleSprite(width) {
    let appleSprite = new createjs.Bitmap("img/apple.png");
    appleSprite.image.onload = function() {
      let scale = width / appleSprite.image.width;
      appleSprite.scaleX = appleSprite.scaleY = scale;
    };
    appleSprite.x -= this._appleSize / 2;
    appleSprite.y -= this._appleSize / 2;

    return appleSprite;
  }

  createAppleLabel(height, value) {
    let fontSize = height * 0.5;
    let label = new createjs.Text();
    label.text = value.toString();
    label.font = `${fontSize}px Dimbo`;
    label.color = "#d3d3d3";
    label.lineWidth = this._appleSize;
    label.textAlign = "center";
    label.textBaseline = "middle";

    return label;
  }

}
