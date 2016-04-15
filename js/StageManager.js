class StageManager {
  static init(canvas) {
    this._canvas = canvas;
    this._stage = null;
    this._isInitialized = true;

    this._width = 800;
    this._height = 450;
  }

  static idle() {
    return this.draw(new IdleScreen());
  }

  static draw(activity) {
    if(!this._isInitialized || activity == null) return false;
    this._activity = activity;
    var screen = this.createScreen();
    activity.draw(screen);
    this.transition(screen);
    return true;
  }

  static update(data) {
    try {
      this._activity.update(data);
    } catch (e) {
      console.log("Update cannot be applied to the current activity. " + JSON.stringify(data));
    }
  }

  static pauseTimer() {
    try {
      this._activity.timer.stop();
    } catch (e) {
      console.log("There is no timer attached to the current activity.");
    }
  }

  static resumeTimer() {
    try {
      this._activity.timer.start();
    } catch (e) {
      console.log("There is no timer attached to the current activity.");
    }
  }

  static abort() {
    this.idle();
  }

  static createStage() {
    var stage = new createjs.Stage(this._canvas);
    stage.canvas.width = this._width;
    stage.canvas.height = this._height;

    // frequency of mouse position checks
    stage.enableMouseOver(20);

    // gets rid of the 300ms delay on touch devices when clicking
    createjs.Touch.enable(stage);

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);

    return stage;
  }

  static createScreen() {
    var screen = new createjs.Container();
    screen.width = this._width;
    screen.height = this._height;
    return screen;
  }

  static resize(keepRatio) {
    if(this._stage == null) return false;

    var headerHeight = document.getElementById('header').offsetHeight;
    var footerHeight = document.getElementById('footer').offsetHeight;

    // browser viewport size
    var w = window.innerWidth;
    var h = window.innerHeight - (headerHeight + footerHeight);

    // canvas dimensions
    var ow = this._width;
    var oh = this._height;

    if(keepRatio) {
      var scale = Math.min(w/ow, h/oh);

      // scale all stage children to the new size
      this._stage.scaleX = scale * window.devicePixelRatio;
      this._stage.scaleY = scale * window.devicePixelRatio;

      // adjust canvas size
      if(w/ow < h/oh) {
        this._stage.canvas.width = w * window.devicePixelRatio;
      } else {
        this._stage.canvas.width = h * this._width/this._height * window.devicePixelRatio;
      }

      this._stage.canvas.height = this._stage.canvas.width * this._height/this._width;
      this._stage.canvas.style.width = this._stage.canvas.width / window.devicePixelRatio + "px";
      this._stage.canvas.style.height = this._stage.canvas.height / window.devicePixelRatio + "px";
    } else {
      // scale all stage children to the new size
      this._stage.scaleX = w/ow * window.devicePixelRatio;
      this._stage.scaleY = h/oh * window.devicePixelRatio;

      // adjust canvas size
      this._stage.canvas.width = w * window.devicePixelRatio;
      this._stage.canvas.height = h * window.devicePixelRatio;
      this._stage.canvas.style.width = w + "px";
      this._stage.canvas.style.height = h + "px";
    }

    return true;
  }

  static transition(newScreen) {
    if(this._stage == null) {
      this._stage = this.createStage();
      this._stage.addChild(newScreen);
    } else {
      // add new screen to the left of the stage
      newScreen.x -= newScreen.width;
      this._stage.addChildAt(newScreen, 0);

      // scroll to the left animation
      createjs.Tween.get(this._stage, { loop: false })
        .call(stopAllAnimations, [this._stage])
        .to({ x: this._stage.canvas.width }, 1000, createjs.Ease.getPowInOut(2))
        .call(removeScreen, [this._stage]);


      function stopAllAnimations(stage) {
        var screen = stage.getChildAt(stage.numChildren - 1);
        for(var i=0; i<screen.numChildren; i++) {
          // Stop all animations and remove event listeners
          createjs.Tween.removeTweens(screen.getChildAt(i));
          screen.getChildAt(i).removeAllEventListeners();
        }
      }

      function removeScreen(stage) {
        var screen = stage.getChildAt(stage.numChildren - 1);
        screen.removeAllChildren();

        // Remove old screen
        stage.removeChild(screen);

        // Change horizontal offset back to 0
        stage.x = stage.getChildAt(0).x = 0;
      }

    }

  }

}
