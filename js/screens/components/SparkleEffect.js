class SparkleEffect {
  constructor() {
    let spriteData = {
			images: ["img/spritesheet_sparkle.png"],
			frames: {width: 21, height: 23, regX: 10, regY: 11}
		};
    this._sprite = new createjs.Sprite(new createjs.SpriteSheet(spriteData));
    this._sparkles = [];
  }

  addTo(container) {
    this._container = container;

    for(let i = 0; i < this._sparkles.length; i++) {
      this.tick(this._sparkles[i]);
    }
  }

  tick(sparkles) {
    if(this._container.getChildIndex(sparkles) < 0) {
      this._container.addChild(sparkles);
    }
		// loop through all of the active sparkles on stage:
		var l = sparkles.numChildren;
		var m = 1; // propagation speed multiplier
		for (let i = l - 1; i >= 0; i--) {
			let sparkle = sparkles.getChildAt(i);
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
				//this._container.removeChild(sparkle);
        sparkles.removeChild(sparkle);
			}
		}
    sparkles.updateCache();
    if(l == 0) {
      this._container.removeChild(sparkles);
      this._sparkles.splice(this._sparkles.indexOf(sparkles), 1);
    } else {
      createjs.Tween.get(this._container)
        .wait(createjs.Ticker.interval)
        .call(this.tick.bind(this), [sparkles]);
    }
	}

	explosionAnimation(count, x, y, speed) {
    let sparkles = new createjs.Container();
    let width = this._container.width;
    let height = this._container.height;

		//create the specified number of sparkles
		for (let i = 0; i < count; i++) {
			// clone the original sparkle, so we don't need to set shared properties:
			let sparkle = this._sprite.clone();
			// set display properties:
			sparkle.x = x;
			sparkle.y = y;
			//sparkle.rotation = Math.random()*360;
			sparkle.alpha = Math.random() * 0.5 + 0.5;
			//sparkle.scaleX = sparkle.scaleY = Math.random() + 0.3;
      let scale = Math.min(width/1000, height/1000);
      sparkle.scaleX = sparkle.scaleY = Math.random() * scale + scale;
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

			// add to the display list:
			sparkles.addChild(sparkle);
		}
    // pick a random color for the sparkles
    sparkles.filters = [ new createjs.ColorFilter(0,0,0,1, Math.random()*255, Math.random()*255, Math.random()*255, 0) ];
    sparkles.cache(0, 0, width, height);
    this._sparkles.push(sparkles);
    if(!this._running) this.tick(sparkles);
  }

}
