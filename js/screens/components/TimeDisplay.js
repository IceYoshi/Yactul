class TimeDisplay {
  constructor(value, submit) {
    this._totalTime = Math.max(Math.round(value), 0);
    this._currentTime = this._totalTime;
    this._tickTime = 1000;
    this._running = false;
    this._submit = submit;
    this._initialized = false;
  }

  addTo(container) {
    this._container = container;
    container.name = "TimeDisplay";

    if(this._currentTime > 0 || !this._submit) {
      this._radius = Math.max(container.width / 9, container.height / 7);

      this._backgroundCircle = this.createBackgroundCircle();
      this._timeLabel = this.createTimeLabel(container.width, container.height, this._currentTime);
      this._progressArc = this.createProgressArc(container.width, container.height);
      this.updateProgressAnimation();
      if(this._running) this.startProgressAnimation();
      container.addChild(this._backgroundCircle, this._progressArc, this._timeLabel);
      if(!this._initialized) {
        this.startTimer(true);
        this._initialized = true;
      }
    }

  }

  createBackgroundCircle() {
    let backgroundCircle = new createjs.Shape();
    backgroundCircle.graphics.beginFill("#d3d3d3").drawCircle(0, 0, this._radius);
    backgroundCircle.filters = [ new createjs.ColorFilter(1,1,1,1) ];
    return backgroundCircle;
  }

  createTimeLabel(width, height, value) {
    let fontSize = Math.floor(Math.max(width / 18, height / 15));
    let label = new createjs.Text();
    label.text = value.toString();
    label.font = `${fontSize}px Dimbo`;
    label.color = "#F0261B";
    label.x = -this._radius * 0.4;
    label.y = this._radius * 0.4;
    label.lineWidth = this._radius;
    label.textAlign = "center";
    label.textBaseline = "middle";
    return label;
  }

  createProgressArc(width, height) {
    let stroke = Math.max(width / 80, height / 60)
    let progressArc = new createjs.Shape();
    progressArc.graphics.setStrokeStyle(stroke).beginStroke("#F0261B").arc(0, 0, this._radius, Math.PI/2, Math.PI);
    progressArc.x = progressArc.regX = 0;
    progressArc.y = progressArc.regY = 0;
    return progressArc;
  }

  startTimer(hideAnimation) {
    if(!this._running) {
      this._running = true;
      this.startProgressAnimation();


      // Date is used to calculate the real time passed between each tick. It makes the timer more accurate.
      this.tick(new Date(new Date().getTime() - this._tickTime));
      if(!hideAnimation) this.statusAnimation("resumed");
    }
  }

  stopTimer() {
    if(this._running) {
      this._running = false;
      this.stopProgressAnimation();
      this.updateProgressAnimation();
      this.statusAnimation("paused");
    }
  }

  tick(date) {
    if(this._currentTime > 0) {
      if(!this._lastSleepTime) this._lastSleepTime = this._tickTime;
      let sleepTime = this._tickTime - (new Date().getTime() - date.getTime() - this._lastSleepTime);
      this._lastSleepTime = sleepTime;
      date = new Date();
      this._timeLabel.persistant = true;
      createjs.Tween.get(this._timeLabel, { loop: false })
        .wait(sleepTime)
        .call(function() {
          if(this._running) {
            if(this._currentTime > 0) {
              this._currentTime--;
              this.updateTimeLabel();
            }
            if(this._currentTime < 6) {
              this.lowTimeAnimation();
            }
            this.tick(date);
          }
        }.bind(this));
    } else {
      this._running = false;
      if(this._submit != null) this._submit();
    }
  }

  updateTimeLabel() {
    this._timeLabel.text = this._currentTime.toString();
  }

  changeTime(timeDifference) {
    this.updateTime(this._currentTime + timeDifference);
  }

  updateTime(value) {
    let oldTime = this._currentTime;
    this._currentTime = Math.max(Math.floor(value), 0);
    if(this._currentTime > this._totalTime) this._totalTime = this._currentTime;
    this.updateTimeLabel();
    this.updateProgressAnimation();

    if(this._running) {
      this.startProgressAnimation();
    }

    let timeDifference = this._currentTime - oldTime;
    let statusText;

    if(timeDifference >= 0) {
      statusText = "+" + timeDifference.toString();
    } else {
      statusText = timeDifference.toString();
    }

    this.statusAnimation(statusText);
  }

  startProgressAnimation() {
    createjs.Tween.get(this._progressArc, { loop: false, override: true })
      .to({ rotation: -90 }, this._currentTime*1000, createjs.Ease.getPowInOut(1));
  }

  stopProgressAnimation() {
    createjs.Tween.removeTweens(this._progressArc);
  }

  updateProgressAnimation() {
    this._progressArc.rotation = -90 * (1 + (-this._currentTime / this._totalTime));
  }

  lowTimeAnimation() {
    this._backgroundCircle.cache(-this._radius, 0, this._radius, this._radius, 2);
    this._backgroundCircle.handleEvent = function() {
      this.updateCache();
    };

    createjs.Tween.get(this._backgroundCircle.filters[0], { loop: false })
    .call(function(bgCircle) {
      createjs.Ticker.addEventListener("tick", bgCircle);
    }, [this._backgroundCircle])
      .to({ redMultiplier: 1.5, greenMultiplier: 0.3, blueMultiplier: 0.3 }, 250)
      .to({ redMultiplier: 1, greenMultiplier: 1, blueMultiplier: 1 }, 250)
      .call(function(bgCircle) {
        createjs.Ticker.removeEventListener("tick", bgCircle);
      }, [this._backgroundCircle]);

  }

  statusAnimation(value) {
    let textSize = Math.floor(Math.max(this._container.width / 25, this._container.height / 25));
    let label = new createjs.Text();
    label.text = value.toString();
    label.font = `${textSize}px Dimbo`;
    label.color = "#F0261B";
    label.x = -this._radius / 2;
    label.y = this._radius;
    label.alpha = 0;
    label.lineWidth = this._radius;
    label.textAlign = "center";
    label.textBaseline = "bottom";

    createjs.Tween.get(label, { loop: false })
      .to({ alpha: 1 }, 1000, createjs.Ease.getPowInOut(1))
      .to({ alpha: 0 }, 1000, createjs.Ease.getPowInOut(1));

    createjs.Tween.get(label, { loop: false })
      .to({ y: 0 }, 2200, createjs.Ease.getPowInOut(2))
      .call(function(container, label) {
        container.removeChild(label);
      }, [this._container, label]);

    this._container.addChild(label);
  }

  getTime() {
    return this._currentTime;
  }

}
