/**
* The StageManager is responsible for directly manipulating the canvas object.
* It manages the screen transition between screens, resizing events, etc.
*/
class StageManager {
  static init(canvas) {
    this._canvas = canvas;
    this._stage = null;

    this._tranScreens = new createjs.Container();
    this._overlay = null;

    this._width = 0;
    this._height = 0;

    StageManager.updateSize();

    this._isInitialized = true;
  }

  /**
  * Simulates a server request to change current screen to idle.
  */
  static idle() {
    return StageManager.draw(new Idle(JSON.parse('{ "cmd":"show", "screen": "Idle", "text":"Waiting for an activity...", "bg":"img/idle.jpg" }')));
  }

  static draw(screen, overlay) {
    if(!this._isInitialized || screen == null) return false;
    window.onkeydown = null;
    window.onkeyup = null;
    let container = StageManager.createScreenContainer();
    $("#placeholder").empty(); //TODO this is just a temporary solution
    screen.draw(container);
    screen.container = container;
    if(overlay) {
      StageManager.addOverlay(screen);
    } else {
      StageManager.transition(screen);
    }
    return true;
  }

  static update(data) {
    try {
      this._currentScreen.update(data);
    } catch (e) {
      console.log('Update cannot be applied to the current screen.');
    }
  }

  static createStage() {
    let stage = new createjs.Stage(this._canvas);
    stage.canvas.width = this._width;
    stage.canvas.height = this._height;

    // frequency per second of mouse position/hit collision checks
    stage.enableMouseOver(20);

    // gets rid of the delay on touch devices when clicking
    createjs.Touch.enable(stage);

    createjs.Ticker.setFPS(30);
    //createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", stage);

    stage.addChild(this._tranScreens);

    return stage;
  }

  static createScreenContainer() {
    let container = new createjs.Container();
    container.width = this._width;
    container.height = this._height;
    return container;
  }

  /**
  * Get size of header and footer and calculate the remaining space
  * of the window. Finally, update the _width and _height attributes.
  */
  static updateSize() {
    let headerHeight = document.getElementById('header').offsetHeight;
    let footerHeight = document.getElementById('footer').offsetHeight;

    this._width = window.innerWidth;
    this._height = window.innerHeight - (headerHeight + footerHeight);

    // devicePixelRation scales the resolution to the actual pixel density of the device (e.g. on retina screens)
    this._width *= window.devicePixelRatio;
    this._height *= window.devicePixelRatio;
  }

  /**
  * Resize has two main objectives.
  * 1. Resize canvas to fit window space
  * 2. Remove any DisplayObjects, animations and event listeners of the
  *    current screen and send a redraw request to the corresponding screen
  */
  static resize() {
    if(this._stage == null) return false;
    StageManager.updateSize();

    let w = this._width;
    let h = this._height;

    this._stage.canvas.width = w;
    this._stage.canvas.height = h;
    this._stage.update();

    StageManager.redrawScreen(this._currentScreen);

    if(this._overlay != null) {
      StageManager.redrawScreen(this._overlay);
    }

    return true;
  }

  static redrawScreen(screen) {
    let container = screen.container;
    Common.removeTweens(container, false);
    container.removeAllChildren();
    container.width = this._stage.canvas.width;
    container.height = this._stage.canvas.height;
    screen.draw(container);
  }

  static addOverlay(screen) {
    if(this._overlay) StageManager.removeOverlay();
    this._overlay = screen;
    screen.container.scaleX = screen.container.scaleY = 0;
    screen.container.alpha = 0.5;
    this._stage.addChildAt(screen.container, 1);
    StageManager.expandOverlay();
  }

  static expandOverlay() {
    if(this._overlay != null) {
      createjs.Tween.get(this._overlay.container, { loop: false, override: true })
        .to({ scaleX: 1, scaleY: 1, alpha: 1 }, 1000, createjs.Ease.getPowInOut(2));
    } else {
      console.log("Cannot expand overlay: There is no active overlay.");
    }
  }

  static minifyOverlay() {
    if(this._overlay != null) {
      createjs.Tween.get(this._overlay.container, { loop: false, override: true })
        .to({ scaleX: 0.25, scaleY: 0.25, alpha: 0.8 }, 1000, createjs.Ease.getPowInOut(2));
    } else {
      console.log("Cannot minify overlay: There is no active overlay.");
    }
  }

  static removeOverlay() {
    if(this._overlay) {
      Common.removeTweens(this._overlay.container);
      createjs.Tween.get(this._overlay.container, { loop: false, override: true })
        .to({ scaleX: 0, scaleY: 0, alpha: 0.5 }, 500, createjs.Ease.getPowInOut(2))
        .call(function() {
          this._stage.removeChild(this._overlay.container);
          this._overlay = null;
        }.bind(this));
    } else {
      console.log("Cannot remove overlay: There is no active overlay.");
    }
  }

  static handleActivityEnd() {
    //TODO The overlay itself may also be the function caller.
    // This case should somehow be detected and, as a result, removeOverlay() should be called.
    StageManager.idle();
    if(this._overlay != null) {
      StageManager.expandOverlay();
    }
  }

  /**
  * Handle screen transition. If there is no current screen being shown,
  * it skips the transition animation.
  * Otherwise the new screen is added to the left (offscreen) of the stage,
  * and a scroll animation to the left is triggered for 1 second.
  * After the animation has stopped, the old screen is removed, the new
  * screen is put on the same position as the old screen and the
  * view point of the stage is set back to default.
  */
  static transition(screen) {
    this._currentScreen = screen;
    let newScreen = screen.container;
    if(this._overlay) StageManager.minifyOverlay();
    if(this._stage == null) {
      this._stage = this.createStage();
      this._tranScreens.addChild(newScreen);
    } else {
      createjs.Ticker.setFPS(60);
      // add new screen to the left of the stage
      newScreen.x -= newScreen.width;
      this._tranScreens.getChildAt(0).x = 0;
      this._tranScreens.addChildAt(newScreen, 0);
      Common.removeTweens(this._tranScreens.getChildAt(1), true);

      for(let i = 1; i<this._tranScreens.numChildren-1; i++) {
        this._tranScreens.removeChildAt(i);
      }

      // scroll to the left animation
      createjs.Tween.get(this._tranScreens, { loop: false, override: true })
        .to({ x: this._stage.canvas.width }, 1000, createjs.Ease.getPowInOut(2))
        .call(removeScreen.bind(this));

      function removeScreen() {
        this._tranScreens.removeChildAt(1);

        // Change horizontal offset back to 0
        this._tranScreens.x = this._tranScreens.getChildAt(0).x = 0;
        createjs.Ticker.setFPS(30);
      }

    }

  }

}
