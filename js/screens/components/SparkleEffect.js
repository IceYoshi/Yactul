class SparkleEffect {
  constructor() {
    this._data = {
			images: ["img/spritesheet_sparkle.png"],
			frames: {width: 21, height: 23, regX: 10, regY: 11}
		};
    this._sprite = new createjs.Sprite(new createjs.SpriteSheet(this._data));
    this._sparkles = [];
    this._running = false;
  }

  addTo(container) {
    this._container = container;
  }

  tick() {
    this._running = true;
		// loop through all of the active sparkles on stage:
		var l = this._sparkles.length;
		var m = 1; // propagation speed multiplier
		for (let i = l - 1; i >= 0; i--) {
			let sparkle = this._sparkles[i];
			// apply gravity and friction
			sparkle.vY += 0.8 * m;
			sparkle.vX *= 0.99;
			// update position, scale, and alpha:
			sparkle.x += sparkle.vX * m;
			sparkle.y += sparkle.vY * m;
			sparkle.scaleX = sparkle.scaleY = sparkle.scaleX + sparkle.vS * m;
			sparkle.alpha += sparkle.vA * m;
			//remove sparkles that are off screen or not invisble
			if (sparkle.alpha <= 0 || sparkle.y > this._container.height) {
				this._container.removeChild(sparkle);
        this._sparkles.splice(i, 1);
			}
      sparkle.updateCache();
		}

    if(l == 0) {
      this._running = false;
    } else {
      createjs.Tween.get(this._container)
        .wait(createjs.Ticker.interval)
        .call(this.tick.bind(this));
    }
	}

	explosionAnimation(count, x, y, speed) {
		//create the specified number of sparkles
		for (let i = 0; i < count; i++) {
			// clone the original sparkle, so we don't need to set shared properties:
			let sparkle = this._sprite.clone();
			// set display properties:
			sparkle.x = x;
			sparkle.y = y;
			//sparkle.rotation = Math.random()*360;
			sparkle.alpha = Math.random() * 0.5 + 0.5;
			sparkle.scaleX = sparkle.scaleY = Math.random() + 0.3;
			// set up velocities:
			let a = Math.PI * 2 * Math.random();
			let v = (Math.random() - 0.5) * 30 * speed;
      if(v == 0) console.log("Haha!");
			sparkle.vX = Math.cos(a) * v;
			sparkle.vY = Math.sin(a) * v;
			sparkle.vS = (Math.random() - 0.5) * 0.2; // scale
			sparkle.vA = -Math.random() * 0.05 - 0.01; // alpha
			// start the animation on a random frame:
			sparkle.gotoAndPlay(Math.random() * sparkle.spriteSheet.getNumFrames());

      // pick a random color for the sparkle sprite
      sparkle.filters = [ new createjs.ColorFilter(0,0,0,1, Math.random()*255, Math.random()*255, Math.random()*255, 0) ];
      sparkle.cache(-11, -12, 21, 23);

			// add to the display list:
			this._container.addChild(sparkle);
      this._sparkles.push(sparkle);
		}
    if(!this._running) this.tick();
  }

}
