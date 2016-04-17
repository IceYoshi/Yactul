class Timer {
  constructor(screen, time, callback) {
    if(time > 0) {
      // time in ms per timer tick
      this._tickTime = 1000;
      this._screen = screen;
      this._running = false;
      // convert time into an int if decimal
      this._time = Math.max(Math.floor(time), 1);
      this._maxValue = this._time;
      this._callback = callback;

      this._backgroundCircle = this.drawBackgroundCircle();
      this._timeLabel = this.createTimeLabel();
      this._progressArc = this.createProgressArc();

      this.start(true);
    }
  }

  change(timedifference) {
    this.update(this._time + timedifference);
  }

  update(time) {
    var oldTime = this._time;
    this._time = Math.max(Math.floor(time), 0);
    if(this._time > this._maxValue) this._maxValue = this._time;
    this.updateTimeLabel();
    this.updateProgressAnimation();

    if(this._running) {
      this.startProgressAnimation();
    }

    var timeDifference = this._time - oldTime;
    var text;

    if(timeDifference >= 0) {
      text = "+" + timeDifference.toString();
    } else {
      text = timeDifference.toString();
    }

    this.changeAnimation(text);
  }

  start(hideAnimation) {
    if(!this._running) {
      this._running = true;
      this.startProgressAnimation();

      // Date is used to calculate the real time passed between each tick. It makes the timer more accurate.
      this.tick(new Date(new Date().getTime() - this._tickTime));
      if(!hideAnimation) this.changeAnimation("started");
    }
  }

  stop() {
    if(this._running) {
      this._running = false;
      this.stopProgressAnimation();
      this.updateProgressAnimation();
      this.changeAnimation("paused");
    }
  }

  tick(date) {
    if(this._time > 0) {
      var sleepTime = this._tickTime - (new Date().getTime() - date.getTime() - this._tickTime);
      date = new Date();
      createjs.Tween.get(this._timeLabel, { loop: false })
        .wait(sleepTime)
        .call(function() {
          if(this._running) {
            if(this._time > 0) {
              this._time--;
              this.updateTimeLabel();
            }
            if(this._time < 6) {
              this.lowTimeAnimation();
            }
            this.tick(date);
          }
        }.bind(this));
    } else {
      this._running = false;
      if(this._callback != null) this._callback();
    }
  }

  createTimeLabel() {
    var timeLabel = new createjs.Text(this._time.toString(), "50px Dimbo", "#F0261B");
    timeLabel.textBaseline = "alphabetic";
    timeLabel.x = this._screen.width - this._screen.width / 20;
    timeLabel.y = this._screen.width / 14;
    timeLabel.lineWidth = this._screen.width / 8;
    timeLabel.textAlign = "center";

    this._screen.addChild(timeLabel);
    return timeLabel;
  }

  updateTimeLabel() {
    this._timeLabel.text = this._time.toString();
  }

  createProgressArc() {
    var progressArc = new createjs.Shape();
    progressArc.graphics.setStrokeStyle(this._screen.width/80).beginStroke("#F0261B").arc(this._screen.width, 0, this._screen.width / 8, Math.PI/2, Math.PI);
    progressArc.x = progressArc.regX = this._screen.width;
    progressArc.y = progressArc.regY = 0;
    this._screen.addChild(progressArc);
    return progressArc;
  }

  startProgressAnimation() {
    createjs.Tween.get(this._progressArc, { loop: false, override: true })
      .to({ rotation: -90 }, this._time*1000, createjs.Ease.getPowInOut(1));
  }

  stopProgressAnimation() {
    createjs.Tween.removeTweens(this._progressArc);
  }

  updateProgressAnimation() {
    this._progressArc.rotation = -90 * (1 + (-this._time / this._maxValue));
  }

  // timer background
  drawBackgroundCircle() {
    var bgCircle = new createjs.Shape();
    bgCircle.graphics.beginFill("#d3d3d3").drawCircle(0, 0, this._screen.width / 8);
    bgCircle.x = this._screen.width;
    bgCircle.y = 0;

    bgCircle.filters = [ new createjs.ColorFilter(1,1,1,1) ];


    this._screen.addChild(bgCircle);
    return bgCircle;
  }

  changeAnimation(text) {
    var label = new createjs.Text(text, "35px Dimbo", "#F0261B");
    label.textBaseline = "alphabetic";
    label.x = this._screen.width - this._screen.width / 15;
    label.y = this._screen.width / 10;
    label.alpha = 0;
    label.lineWidth = this._screen.width / 8;
    label.textAlign = "center";

    createjs.Tween.get(label, { loop: false })
      .to({ alpha: 1 }, 1000, createjs.Ease.getPowInOut(1))
      .to({ alpha: 0 }, 1000, createjs.Ease.getPowInOut(1));

    createjs.Tween.get(label, { loop: false })
      .to({ y: 0 }, 2200, createjs.Ease.getPowInOut(3))
      .call(function(screen, label) {
        screen.removeChild(label);
      }, [this._screen, label]);

    this._screen.addChild(label);

  }

  lowTimeAnimation() {
    this._backgroundCircle.cache(-this._screen.width / 8, 0, this._screen.width / 8, this._screen.width / 8, 2);
    this._backgroundCircle.handleEvent = function() {
      this.updateCache();
    };

    createjs.Tween.get(this._backgroundCircle.filters[0], { loop: false })
    .call(function(bgCircle) {
      createjs.Ticker.addEventListener("tick", bgCircle);
    }, [this._backgroundCircle])
      .to({ redMultiplier: 1.5, greenMultiplier: 0.5, blueMultiplier: 0.5 }, 300)
      .to({ redMultiplier: 1, greenMultiplier: 1, blueMultiplier: 1 }, 300)
      .call(function(bgCircle) {
        createjs.Ticker.removeEventListener("tick", bgCircle);
      }, [this._backgroundCircle]);

  }

}
