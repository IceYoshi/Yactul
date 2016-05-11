class StageManager {
  static init(canvas) {
    this._canvas = canvas;
    this._stage = null;

    this._width = 0;
    this._height = 0;

    this.updateSize();

    this._isInitialized = true;
  }

  static idle() {
    return this.draw(new Idle(JSON.parse('{ "cmd":"show", "screen": "Idle", "text":"Waiting for an activity...", "bg":"img/idle.jpg" }')));
  }

  static draw(screen) {
    if(!this._isInitialized || screen == null) return false;
    this._currentScreen = screen;
    let container = this.createScreenContainer();
    screen.draw(container);
    screen.container = container;
    this.transition(container);
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
    let stage = new createjs.Stage(this._canvas, false, false);
    stage.canvas.width = this._width;
    stage.canvas.height = this._height;

    // frequency of mouse position checks
    stage.enableMouseOver(20);
    stage.autoClear = false;

    // gets rid of the 300ms delay on touch devices when clicking
    createjs.Touch.enable(stage);

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", stage);
    //createjs.Ticker.timingMode = createjs.Ticker.RAF;

    return stage;
  }

  static createScreenContainer() {
    let container = new createjs.Container();
    container.width = this._width;
    container.height = this._height;
    return container;
  }

  static updateSize() {
    let headerHeight = document.getElementById('header').offsetHeight;
    let footerHeight = document.getElementById('footer').offsetHeight;

    this._width = window.innerWidth;
    this._height = window.innerHeight - (headerHeight + footerHeight);
    this._width *= window.devicePixelRatio;
    this._height *= window.devicePixelRatio;
  }

  static resize() {
    if(this._stage == null) return false;
    this.updateSize();

    let w = this._width;
    let h = this._height;

    this._stage.canvas.width = w;
    this._stage.canvas.height = h;
    this._stage.update();

    let container = this._currentScreen.container;
    container.width = w;
    container.height = h;
    for(let i=0; i<container.numChildren; i++) {
      // Stop all animations and remove event listeners
      createjs.Tween.removeTweens(container.getChildAt(i));
      container.getChildAt(i).removeAllEventListeners();
    }

    container.removeAllChildren();
    container.removeAllEventListeners();
    this._currentScreen.draw(container);

    return true;
  }

  static transition(newScreen) {
    if(this._stage == null) {
      this._stage = this.createStage();
      this._stage.addChild(newScreen);
    } else {
      createjs.Ticker.setFPS(60);
      // add new screen to the left of the stage
      newScreen.x -= newScreen.width;
      this._stage.addChildAt(newScreen, 0);

      // scroll to the left animation
      createjs.Tween.get(this._stage, { loop: false })
        .call(stopAllAnimations, [this._stage])
        .to({ x: this._stage.canvas.width }, 1000, createjs.Ease.getPowInOut(2))
        .call(removeScreen, [this._stage]);


      function stopAllAnimations(stage) {
        let screen = stage.getChildAt(stage.numChildren - 1);
        for(let i=0; i<screen.numChildren; i++) {
          let component = screen.getChildAt(i);
          for(let j=0; j<component.numChildren; j++) {
            // Stop all animations and remove event listeners
            createjs.Tween.removeTweens(component.getChildAt(j));
            component.getChildAt(j).removeAllEventListeners();
          }
          createjs.Tween.removeTweens(screen.getChildAt(i));
          screen.getChildAt(i).removeAllEventListeners();
        }
      }

      function removeScreen(stage) {
        let screen = stage.getChildAt(stage.numChildren - 1);
        screen.removeAllChildren();

        // Remove old screen
        stage.removeChild(screen);

        // Change horizontal offset back to 0
        stage.x = stage.getChildAt(0).x = 0;
        createjs.Ticker.setFPS(30);
      }

    }

  }

}
