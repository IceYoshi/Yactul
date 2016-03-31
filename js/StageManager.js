class StageManager {
  static init(canvas) {
    this._canvas = canvas;
    this._stage = null;
    this._isInitialized = true;
  }

  static idle() {
    return this.draw(new IdleScreen());
  }

  static draw(activity) {
    if(!this._isInitialized || activity == null) return false;

    var screen = this.createScreen();
    activity.draw(screen);
    this.transition(screen);
    return true;
  }

  static change(data) {
    console.log("StageManager.change - Not yet implemented");
  }

  static interrupt() {
    this.idle();
  }

  static createStage() {
    var stage = new createjs.Stage(this._canvas);
    stage.canvas.width = 800;
    stage.canvas.height = 450;

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
    screen.width = 800;
    screen.height = 450;
    return screen;
  }

  static resize() {
    if(this._stage == null) return false;

    var headerHeight = document.getElementById('header').offsetHeight;
    var footerHeight = document.getElementById('footer').offsetHeight;

    // browser viewport size
    var w = window.innerWidth;
    var h = window.innerHeight - (headerHeight + footerHeight);

    // canvas dimensions
    var ow = this._stage.canvas.width;
    var oh = this._stage.canvas.height;

    // Check if a resize has to be done
    if(w/ow != 1 || h/oh != 1) {
      // scale all stage children to the new size
      this._stage.scaleX *= w/ow;
      this._stage.scaleY *= h/oh;

      // adjust canvas size
      this._stage.canvas.width *= w/ow;
      this._stage.canvas.height *= h/oh;
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
        .to({ x: this._stage.canvas.width }, 1000, createjs.Ease.getPowInOut(2))
        .call(transitionCompleted, [this._stage]);

      function transitionCompleted(stage) {
        var screen = stage.getChildAt(stage.numChildren - 1);
        for(var i=0; i<screen.numChildren; i++) {
          // Stop all animations and remove event listeners
          createjs.Tween.removeTweens(screen.getChildAt(i));
          screen.getChildAt(i).removeAllEventListeners();
        }
        screen.removeAllChildren();

        // Remove old screen
        stage.removeChild(screen);

        // Change horizontal offset back to 0
        stage.x = stage.getChildAt(0).x = 0;
      }

    }
    resize();

  }

}
