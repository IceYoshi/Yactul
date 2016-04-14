"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StageManager = function () {
  function StageManager() {
    _classCallCheck(this, StageManager);
  }

  _createClass(StageManager, null, [{
    key: "init",
    value: function init(canvas) {
      this._canvas = canvas;
      this._stage = null;
      this._isInitialized = true;

      this._width = 800;
      this._height = 450;
    }
  }, {
    key: "idle",
    value: function idle() {
      return this.draw(new IdleScreen());
    }
  }, {
    key: "draw",
    value: function draw(activity) {
      if (!this._isInitialized || activity == null) return false;
      this._activity = activity;
      var screen = this.createScreen();
      activity.draw(screen);
      this.transition(screen);
      return true;
    }
  }, {
    key: "updateTimer",
    value: function updateTimer(data) {
      try {
        this._activity.timer.change(data.time);
      } catch (e) {
        console.log("There is no timer attached to the current activity.");
      }
    }
  }, {
    key: "pauseTimer",
    value: function pauseTimer() {
      try {
        this._activity.timer.stop();
      } catch (e) {
        console.log("There is no timer attached to the current activity.");
      }
    }
  }, {
    key: "resumeTimer",
    value: function resumeTimer() {
      try {
        this._activity.timer.start();
      } catch (e) {
        console.log("There is no timer attached to the current activity.");
      }
    }
  }, {
    key: "abort",
    value: function abort() {
      this.idle();
    }
  }, {
    key: "createStage",
    value: function createStage() {
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
  }, {
    key: "createScreen",
    value: function createScreen() {
      var screen = new createjs.Container();
      screen.width = this._width;
      screen.height = this._height;
      return screen;
    }
  }, {
    key: "resize",
    value: function resize(keepRatio) {
      if (this._stage == null) return false;

      var headerHeight = document.getElementById('header').offsetHeight;
      var footerHeight = document.getElementById('footer').offsetHeight;

      // browser viewport size
      var w = window.innerWidth;
      var h = window.innerHeight - (headerHeight + footerHeight);

      // canvas dimensions
      var ow = this._width;
      var oh = this._height;

      if (keepRatio) {
        var scale = Math.min(w / ow, h / oh);

        // scale all stage children to the new size
        this._stage.scaleX = scale * window.devicePixelRatio;
        this._stage.scaleY = scale * window.devicePixelRatio;

        // adjust canvas size
        if (w / ow < h / oh) {
          this._stage.canvas.width = w * window.devicePixelRatio;
        } else {
          this._stage.canvas.width = h * this._width / this._height * window.devicePixelRatio;
        }

        this._stage.canvas.height = this._stage.canvas.width * this._height / this._width;
        this._stage.canvas.style.width = this._stage.canvas.width / window.devicePixelRatio + "px";
        this._stage.canvas.style.height = this._stage.canvas.height / window.devicePixelRatio + "px";
      } else {
        // scale all stage children to the new size
        this._stage.scaleX = w / ow * window.devicePixelRatio;
        this._stage.scaleY = h / oh * window.devicePixelRatio;

        // adjust canvas size
        this._stage.canvas.width = w * window.devicePixelRatio;
        this._stage.canvas.height = h * window.devicePixelRatio;
        this._stage.canvas.style.width = w + "px";
        this._stage.canvas.style.height = h + "px";
      }

      return true;
    }
  }, {
    key: "transition",
    value: function transition(newScreen) {
      if (this._stage == null) {
        this._stage = this.createStage();
        this._stage.addChild(newScreen);
      } else {
        var transitionCompleted = function transitionCompleted(stage) {
          var screen = stage.getChildAt(stage.numChildren - 1);
          for (var i = 0; i < screen.numChildren; i++) {
            // Stop all animations and remove event listeners
            createjs.Tween.removeTweens(screen.getChildAt(i));
            screen.getChildAt(i).removeAllEventListeners();
          }
          screen.removeAllChildren();

          // Remove old screen
          stage.removeChild(screen);

          // Change horizontal offset back to 0
          stage.x = stage.getChildAt(0).x = 0;
        };

        // add new screen to the left of the stage
        newScreen.x -= newScreen.width;
        this._stage.addChildAt(newScreen, 0);

        // scroll to the left animation
        createjs.Tween.get(this._stage, { loop: false }).to({ x: this._stage.canvas.width }, 1000, createjs.Ease.getPowInOut(2)).call(transitionCompleted, [this._stage]);
      }
    }
  }]);

  return StageManager;
}();

var MessageInterpreter = function () {
  function MessageInterpreter() {
    _classCallCheck(this, MessageInterpreter);
  }

  _createClass(MessageInterpreter, null, [{
    key: "interpret",
    value: function interpret(data) {
      switch (data.cmd) {
        case "start":
          StageManager.draw(this.getActivity(data));
          break;
        case "update":
          StageManager.updateTimer(data);
          break;
        case "pause":
          StageManager.pauseTimer();
          break;
        case "resume":
          StageManager.resumeTimer();
          break;
        case "abort":
          StageManager.abort();
          break;
        default:
          console.log('Error: Unknown command ' + data.cmd);
      }
    }
  }, {
    key: "getActivity",
    value: function getActivity(data) {
      try {
        return eval('(new ' + data.activity + '(data))');
      } catch (e) {
        // Fallback, needed when the js code gets compressed (class->function convertion)
        try {
          return new window[data.activity](data);
        } catch (e) {
          console.log('ReferenceError: Activity ' + data.activity + ' is not defined.');
          return null;
        }
      }
    }
  }]);

  return MessageInterpreter;
}();

var ServerConnection = function () {
  function ServerConnection() {
    _classCallCheck(this, ServerConnection);
  }

  _createClass(ServerConnection, null, [{
    key: "init",
    value: function init(serverAddress) {
      this._server = serverAddress;
      this._isInitialized = true;
    }
  }, {
    key: "send",
    value: function send(data) {
      if (!this._isInitialized) return false;

      // TODO: send data to server
      console.log('To server: ' + JSON.stringify(data));

      return true;
    }
  }, {
    key: "receive",
    value: function receive(data) {
      if (!this._isInitialized) return false;

      console.log('From server: ' + JSON.stringify(data));
      MessageInterpreter.interpret(data);

      return true;
    }
  }]);

  return ServerConnection;
}();

var SimpleQuestion = function () {
  function SimpleQuestion(data) {
    _classCallCheck(this, SimpleQuestion);

    this._data = data;
    this._selected = [null];
    this._submitted = false;
  }

  _createClass(SimpleQuestion, [{
    key: "draw",
    value: function draw(stage) {
      switch (this._data.view) {
        case "student":
          new BackgroundImage(stage, this._data.bg);
          this._timer = new Timer(stage, this._data.time, this.submit.bind(this));
          new DifficultyMeter(stage, this._data.difficulty);
          new Title(stage, this._data.text);
          new AnswerButtons(stage, this._data.answers, this.selected.bind(this));
          break;
        case "projector":
          new BackgroundImage(stage, this._data.bg);
          this._timer = new Timer(stage, this._data.time, null);
          new DifficultyMeter(stage, this._data.difficulty);
          new Title(stage, this._data.text);
          new AnswerButtons(stage, this._data.answers, null);
          break;
      }
    }
  }, {
    key: "selected",
    value: function selected(value) {
      this._selected = value;
      this.submit();
    }
  }, {
    key: "submit",
    value: function submit() {
      if (this._submitted) return;
      var obj = JSON.parse('{' + '"cmd" : "submit",' + '"activity" : "' + this._data.activity + '",' + '"id" : ' + this._data.id + ',' + '"selected" : ' + JSON.stringify(this._selected[0]) + '}');
      if (ServerConnection.send(obj)) {
        this._submitted = true;
        StageManager.idle();
      }
    }
  }, {
    key: "timer",
    get: function get() {
      return this._timer;
    }
  }]);

  return SimpleQuestion;
}();

var IdleScreen = function () {
  function IdleScreen() {
    _classCallCheck(this, IdleScreen);
  }

  _createClass(IdleScreen, [{
    key: "draw",
    value: function draw(stage) {
      var background = new BackgroundImage(stage, "img/idle.jpg");
      var title = new Title(stage, "Waiting for an activity...");
    }
  }]);

  return IdleScreen;
}();

var StopButton = function StopButton(screen, callback) {
  _classCallCheck(this, StopButton);

  var radius = Math.min(screen.width / 6, screen.height / 5);

  var stopLabel = new createjs.Text("Stop !", "bold 40px Dimbo", "#d3d3d3");
  stopLabel.textBaseline = "middle";
  stopLabel.x = screen.width / 2;
  stopLabel.y = screen.height * 0.75;
  stopLabel.textAlign = "center";

  var bgCircle = new createjs.Shape();
  bgCircle.graphics.beginRadialGradientFill(["#F0261B", "#C01E15"], [0, 1], 0, 0, 0, 0, 0, radius).drawCircle(0, 0, radius);
  bgCircle.x = screen.width / 2;
  bgCircle.y = screen.height * 0.75;
  bgCircle.shadow = new createjs.Shadow("#000000", 5, 5, 10);

  // mouse handlers
  bgCircle.on("click", handleClick);
  bgCircle.on("mouseover", handleMotion);
  bgCircle.on("mouseout", handleMotion);

  // validate click handler
  function handleClick(event) {
    if (callback != null) {
      event.target.filters = [new createjs.ColorFilter(0, 0, 0, 1, 144, 22, 16, 0)];
      event.target.cache(-radius, -radius, 2 * radius, 2 * radius);
      callback();
    }
  }

  // mouseover animation
  function handleMotion(event) {
    switch (event.type) {
      case "mouseover":
        // r, g, b, a - multiply old values, then add offset to them
        event.target.filters = [new createjs.ColorFilter(1, 1, 1, 1, -25, -25, -25, 0)];
        break;
      case "mouseout":
        event.target.filters = [new createjs.ColorFilter(1, 1, 1, 1, 0, 0, 0, 0)];
        break;
    }
    event.target.cache(-radius, -radius, 2 * radius, 2 * radius);
  }

  screen.addChild(bgCircle);
  screen.addChild(stopLabel);
};

var AnswerCycle = function AnswerCycle(screen, answers, callback) {
  _classCallCheck(this, AnswerCycle);

  if (answers.length > 0) {
    var cycleLabel;
    var sleepTime;

    (function () {
      var update = function update(i) {
        createjs.Tween.get(cycleLabel).to({ text: answers[i] }).wait(sleepTime).call(handleComplete, [callback]);
        function handleComplete(callback) {
          if (++i >= answers.length) i = 0;
          if (callback != null) callback([answers[i]]);
          update(i);
        }
      };

      // cyclic answer label
      cycleLabel = new createjs.Text(answers[0], "30px Dimbo", "#000000");

      cycleLabel.x = screen.width / 2;
      cycleLabel.y = screen.height * 0.4;
      cycleLabel.textAlign = "center";

      if (callback != null) callback([answers[0]]);
      sleepTime = 1500;

      update(0);

      screen.addChild(cycleLabel);
    })();
  }
};

var Timer = function () {
  function Timer(screen, time, callback) {
    _classCallCheck(this, Timer);

    if (time > 0) {
      // time in ms per timer tick
      this._tickTime = 1000;
      this._screen = screen;
      this._running = false;
      // convert time into an int if decimal
      this._time = Math.max(Math.floor(time), 1);
      this._callback = callback;

      this.drawBackgroundCircle();
      this._timeLabel = this.createTimeLabel();
      this._progressArc = this.createProgressArc();

      this.start();
    }
  }

  _createClass(Timer, [{
    key: "change",
    value: function change(time) {
      var oldTime = this._time;
      this._time = Math.max(Math.floor(time), 1);
      this.updateTimeLabel();
      if (this._running) {
        this.startProgressAnimation();
      }
      this.changeAnimation(this._time - oldTime);
    }
  }, {
    key: "start",
    value: function start() {
      if (!this._running) {
        this._running = true;
        this.startProgressAnimation();

        // Date is used to calculate the real time passed between each tick. It makes the timer more accurate.
        this.tick(new Date(new Date().getTime() - this._tickTime));
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      this._running = false;
      this.stopProgressAnimation();
    }
  }, {
    key: "tick",
    value: function tick(date) {
      if (this._time > 0) {
        var sleepTime = this._tickTime - (new Date().getTime() - date.getTime() - this._tickTime);
        date = new Date();
        createjs.Tween.get(this._timeLabel, { loop: false }).wait(sleepTime).call(function () {
          if (this._running) {
            this._time--;
            this.updateTimeLabel();
            this.tick(date);
          }
        }.bind(this));
      } else {
        if (this._callback != null) this._callback();
      }
    }
  }, {
    key: "createTimeLabel",
    value: function createTimeLabel() {
      var timeLabel = new createjs.Text(this._time.toString(), "50px Dimbo", "#F0261B");
      timeLabel.textBaseline = "alphabetic";
      timeLabel.x = this._screen.width - this._screen.width / 20;
      timeLabel.y = this._screen.width / 14;
      timeLabel.lineWidth = this._screen.width / 8;
      timeLabel.textAlign = "center";

      this._screen.addChild(timeLabel);
      return timeLabel;
    }
  }, {
    key: "updateTimeLabel",
    value: function updateTimeLabel() {
      this._timeLabel.text = this._time.toString();
    }
  }, {
    key: "createProgressArc",
    value: function createProgressArc() {
      var progressArc = new createjs.Shape();
      progressArc.graphics.setStrokeStyle(this._screen.width / 80).beginStroke("#F0261B").arc(this._screen.width, 0, this._screen.width / 8, Math.PI / 2, Math.PI);
      progressArc.x = progressArc.regX = this._screen.width;
      progressArc.y = progressArc.regY = 0;
      this._screen.addChild(progressArc);
      return progressArc;
    }
  }, {
    key: "startProgressAnimation",
    value: function startProgressAnimation() {
      createjs.Tween.get(this._progressArc, { loop: false, override: true }).to({ rotation: -90 }, this._time * 1000, createjs.Ease.getPowInOut(1));
    }
  }, {
    key: "stopProgressAnimation",
    value: function stopProgressAnimation() {
      createjs.Tween.removeTweens(this._progressArc);
    }

    // timer background

  }, {
    key: "drawBackgroundCircle",
    value: function drawBackgroundCircle() {
      var bgCircle = new createjs.Shape();
      bgCircle.graphics.beginFill("#d3d3d3").drawCircle(0, 0, this._screen.width / 8);
      bgCircle.x = this._screen.width;
      bgCircle.y = 0;

      this._screen.addChild(bgCircle);
    }
  }, {
    key: "changeAnimation",
    value: function changeAnimation(timeDifference) {
      var text;
      if (timeDifference >= 0) {
        text = "+" + timeDifference.toString();
      } else {
        text = timeDifference.toString();
      }

      var label = new createjs.Text(text, "35px Dimbo", "#F0261B");
      label.textBaseline = "alphabetic";
      label.x = this._screen.width - this._screen.width / 20;
      label.y = this._screen.width / 10;
      label.alpha = 0;
      label.lineWidth = this._screen.width / 8;
      label.textAlign = "center";

      createjs.Tween.get(label, { loop: false }).to({ alpha: 1 }, 1000, createjs.Ease.getPowInOut(1)).to({ alpha: 0 }, 1000, createjs.Ease.getPowInOut(1));

      createjs.Tween.get(label, { loop: false }).to({ y: 0 }, 2200, createjs.Ease.getPowInOut(3));
      //  .call();

      this._screen.addChild(label);
    }
  }]);

  return Timer;
}();

var BackgroundImage = function BackgroundImage(screen, imagePath) {
  _classCallCheck(this, BackgroundImage);

  var bg = new createjs.Bitmap(imagePath);

  // Resize image to full screen
  bg.image.onload = function () {
    bg.scaleX = screen.width / bg.image.width;
    bg.scaleY = screen.height / bg.image.height;
  };

  // Add image at layer 0 (behind other objects)
  screen.addChildAt(bg, 0);
};

var AnswerButtons = function AnswerButtons(screen, answers, callback) {
  _classCallCheck(this, AnswerButtons);

  var numAnswers = answers.length;
  var numRows = Math.ceil(numAnswers / 2);
  var paddingX = screen.width / 30;
  var paddingY = screen.height / 50;

  // transparent background panel for the buttons
  var answerPanel = new createjs.Shape();
  answerPanel.graphics.beginFill("#d3d3d3").drawRoundRect(0, 0, screen.width - paddingX, screen.height / 2, 0);
  answerPanel.x = paddingX / 2;
  answerPanel.y = screen.height / 2 - paddingY * 4;
  answerPanel.alpha = 0.4;
  screen.addChild(answerPanel);
  var answerObjects = [];

  for (var i = 0; i < numAnswers; i++) {
    var answer = answers[i];
    var width = screen.width / 2 - paddingX * 1.5;
    var height = screen.height / (2 * numRows) - paddingY * 1.5;
    var x = paddingX + i % 2 * (paddingX + width);
    var y = screen.height / 2 - paddingY * 3 + Math.floor(i / 2) * (paddingY + height);

    // button label
    var answerLabel = new createjs.Text(answer);
    answerLabel.lineWidth = width - paddingX / 2;
    answerLabel.lineHeight = height / 3;
    answerLabel.font = "26px Dimbo";
    var numAnswerLines = answerLabel.getMeasuredHeight() / answerLabel.lineHeight;
    var fontSize = Math.min(Math.floor(height / numAnswerLines), 26);
    answerLabel.font = fontSize + "px Dimbo";
    numAnswerLines = answerLabel.getMeasuredHeight() / answerLabel.lineHeight;
    answerLabel.color = "#F0261B";
    answerLabel.textAlign = "center";
    answerLabel.textBaseline = "middle";
    answerLabel.x = x + width / 2;
    answerLabel.y = y + height / 2 - (numAnswerLines - 1) * answerLabel.lineHeight / 2;

    // button panel
    var answerRect = new createjs.Shape();
    answerRect.graphics.beginFill("#d3d3d3").drawRoundRect(0, 0, width, height, 0);
    answerRect.x = x;
    answerRect.y = y;
    answerRect.label = answer;
    answerRect.shadow = new createjs.Shadow("#333333", 5, 5, 10);

    answerRect.on("click", handleClick);
    answerRect.on("mouseover", handleMotion);
    answerRect.on("mouseout", handleMotion);

    answerObjects.push(answerRect);

    screen.addChild(answerRect);
    screen.addChild(answerLabel);
  }

  // click handler
  function handleClick(event) {
    if (event.target.clicked == null) {
      event.target.filters = [new createjs.ColorFilter(0, 0, 0, 1, 255, 203, 151, 0)];
      event.target.clicked = 1;
    } else {
      if (event.isTouch) {
        event.target.filters = [new createjs.ColorFilter(1, 1, 1, 1, 0, 0, 0, 0)];
      } else {
        event.target.filters = [new createjs.ColorFilter(1, 1, 1, 1, -25, -25, -25, 0)];
      }
      event.target.clicked = null;
    }
    event.target.cache(0, 0, event.target.graphics.command.w, event.target.graphics.command.h);

    if (callback != null) {
      var selected = [];
      for (var j = 0; j < answerObjects.length; j++) {
        if (answerObjects[j].clicked != null) {
          selected.push(answerObjects[j].label);
        }
      }
      callback(selected);
    }
  }

  // mouseover animation
  function handleMotion(event) {
    if (event.target.clicked == null) {
      switch (event.type) {
        case "mouseover":
          // r, g, b, a - multiply old values, then add offset to them
          event.target.filters = [new createjs.ColorFilter(1, 1, 1, 1, -25, -25, -25, 0)];
          break;
        case "mouseout":
          event.target.filters = [new createjs.ColorFilter(1, 1, 1, 1, 0, 0, 0, 0)];
          break;
      }
      event.target.cache(0, 0, event.target.graphics.command.w, event.target.graphics.command.h);
    }
  }
};

var ValidateButton = function ValidateButton(screen, callback) {
  _classCallCheck(this, ValidateButton);

  // validate label
  var validateLabel = new createjs.Text("Validate", "30px Dimbo", "#F0261B");
  validateLabel.x = screen.width;
  validateLabel.y = screen.height;
  validateLabel.textAlign = "right";
  validateLabel.textBaseline = "alphabetic";

  // validate background
  var validateRect = new createjs.Shape();
  validateRect.graphics.beginFill("#d3d3d3").drawRoundRectComplex(0, 0, validateLabel.getMeasuredWidth() + validateLabel.getMeasuredHeight() / 2, 3 / 2 * validateLabel.getMeasuredHeight(), validateLabel.getMeasuredHeight(), 0, 0, 0);
  validateRect.x = screen.width - validateLabel.getMeasuredWidth() - validateLabel.getMeasuredHeight() / 2;
  validateRect.y = screen.height - 4 / 3 * validateLabel.getMeasuredHeight();

  // mouse handlers
  validateRect.on("click", handleClick);
  validateRect.on("mouseover", handleMotion);
  validateRect.on("mouseout", handleMotion);

  // validate click handler
  function handleClick(event) {
    if (callback != null) {
      event.target.filters = [new createjs.ColorFilter(0, 0, 0, 1, 255, 203, 151, 0)];
      event.target.cache(0, 0, event.target.graphics.command.w, event.target.graphics.command.h);
      if (callback != null) callback();
    }
  }

  // mouseover animation
  function handleMotion(event) {
    switch (event.type) {
      case "mouseover":
        // r, g, b, a - multiply old values, then add offset to them
        event.target.filters = [new createjs.ColorFilter(1, 1, 1, 1, -25, -25, -25, 0)];
        break;
      case "mouseout":
        event.target.filters = [new createjs.ColorFilter(1, 1, 1, 1, 0, 0, 0, 0)];
        break;
    }
    event.target.cache(0, 0, event.target.graphics.command.w, event.target.graphics.command.h);
  }

  screen.addChild(validateRect);
  screen.addChild(validateLabel);
};

var InteractiveImage = function InteractiveImage(screen, imagePath, callback) {
  _classCallCheck(this, InteractiveImage);

  var bg = new createjs.Bitmap(imagePath);

  var padding = screen.width / 20;

  //bg.x = padding;
  bg.y = screen.height / 2 - 2 * padding;

  bg.image.onload = function () {
    // Keep aspect ratio
    var scale = Math.min(9 / 10 * screen.width / bg.image.width, (screen.height / 2 + padding) / bg.image.height);
    bg.scaleX = scale;
    bg.scaleY = scale;
    bg.x = (screen.width - bg.image.width * bg.scaleX) / 2;
  };

  bg.shadow = new createjs.Shadow("#333333", 5, 5, 10);

  bg.on("click", handleClick);

  function handleClick(event) {
    if (callback != null) {
      var star = new createjs.Shape();
      star.graphics.beginFill("#000000").drawPolyStar(0, 0, screen.width / 80, 5, 0.6, -90);
      star.x = event.stageX / screen.stage.scaleX;
      star.y = event.stageY / screen.stage.scaleY;
      screen.addChild(star);
      callback([Math.round(event.localX), Math.round(event.localY)]);
    }
  }

  // Add background image at layer 0 (behind other objects)
  screen.addChild(bg);
};

var Title = function Title(screen, question) {
  _classCallCheck(this, Title);

  var width = screen.width * 0.75;
  var height = screen.height / 13;
  var paddingTop = screen.height * 1.5 / 10;
  var paddingLeft = (screen.width - width) / 2;
  var paddingRect = height / 4;

  // question multiline label
  var questionLabel = new createjs.Text(question, "30px Dimbo", "#F0261B");
  questionLabel.x = screen.width / 2;
  questionLabel.y = paddingTop;
  questionLabel.lineWidth = width - 10;
  questionLabel.lineHeight = height;
  questionLabel.textAlign = "center";

  var numOfLines = questionLabel.getMeasuredHeight() / height;

  // background question rounded rectangle
  var questionRect = new createjs.Shape();
  questionRect.graphics.beginFill("#d3d3d3").drawRoundRect(0, 0, width, height * numOfLines + paddingRect * 2, height / 2);
  questionRect.x = paddingLeft;
  questionRect.y = paddingTop - paddingRect;

  screen.addChild(questionRect);
  screen.addChild(questionLabel);
};

var DifficultyMeter = function DifficultyMeter(screen, value) {
  _classCallCheck(this, DifficultyMeter);

  var maxDifficulty = 5;
  value = Math.min(value, maxDifficulty);

  var paddingTop = screen.height / 20;
  var paddingBetween = screen.width / 30;

  for (var i = 0; i < maxDifficulty; i++) {
    var star = new createjs.Shape();
    if (value > i) {
      star.graphics.beginFill("#F0261B");
    } else {
      star.graphics.beginFill("#333333");
    }

    star.graphics.drawPolyStar(0, 0, screen.width / 80, 5, 0.6, -90);
    star.x = screen.width / 2 - (maxDifficulty / 2 - i) * paddingBetween + paddingBetween / 2;
    star.y = paddingTop;
    screen.addChild(star);
  }
};

var MultipleChoiceQuestion = function () {
  function MultipleChoiceQuestion(data) {
    _classCallCheck(this, MultipleChoiceQuestion);

    this._data = data;
    this._selected = [];
    this._submitted = false;
  }

  _createClass(MultipleChoiceQuestion, [{
    key: "draw",
    value: function draw(stage) {
      switch (this._data.view) {
        case "student":
          new BackgroundImage(stage, this._data.bg);
          this._timer = new Timer(stage, this._data.time, this.submit.bind(this));
          new DifficultyMeter(stage, this._data.difficulty);
          new Title(stage, this._data.text);
          new AnswerButtons(stage, this._data.answers, this.selected.bind(this));
          new ValidateButton(stage, this.submit.bind(this));
          break;
        case "projector":
          new BackgroundImage(stage, this._data.bg);
          this._timer = new Timer(stage, this._data.time, null);
          new DifficultyMeter(stage, this._data.difficulty);
          new Title(stage, this._data.text);
          new AnswerButtons(stage, this._data.answers, null);
          break;
      }
    }
  }, {
    key: "selected",
    value: function selected(value) {
      this._selected = value;
    }
  }, {
    key: "submit",
    value: function submit() {
      if (this._submitted) return;
      var obj = JSON.parse('{' + '"cmd" : "submit",' + '"activity" : "' + this._data.activity + '",' + '"id" : ' + this._data.id + ',' + '"selected" : ' + JSON.stringify(this._selected) + '}');
      if (ServerConnection.send(obj)) {
        this._submitted = true;
        StageManager.idle();
      }
    }
  }, {
    key: "timer",
    get: function get() {
      return this._timer;
    }
  }]);

  return MultipleChoiceQuestion;
}();

var PointAndClick = function () {
  function PointAndClick(data) {
    _classCallCheck(this, PointAndClick);

    this._data = data;
    this._selected = [];
    this._submitted = false;
  }

  _createClass(PointAndClick, [{
    key: "draw",
    value: function draw(stage) {
      switch (this._data.view) {
        case "student":
          new BackgroundImage(stage, this._data.bg);
          this._timer = new Timer(stage, this._data.time, this.submit.bind(this));
          new DifficultyMeter(stage, this._data.difficulty);
          new Title(stage, this._data.text);
          new InteractiveImage(stage, this._data.imagePath, this.selected.bind(this));
          break;
        case "projector":
          new BackgroundImage(stage, this._data.bg);
          this._timer = new Timer(stage, this._data.time, null);
          new DifficultyMeter(stage, this._data.difficulty);
          new Title(stage, this._data.text);
          new InteractiveImage(stage, this._data.imagePath, null);
          break;
      }
    }
  }, {
    key: "selected",
    value: function selected(value) {
      this._selected = value;
      this.submit();
    }
  }, {
    key: "submit",
    value: function submit() {
      if (this._submitted) return;
      var obj = JSON.parse('{' + '"cmd" : "submit",' + '"activity" : "' + this._data.activity + '",' + '"id" : ' + this._data.id + ',' + '"selected" : ' + JSON.stringify(this._selected) + '}');
      if (ServerConnection.send(obj)) {
        this._submitted = true;
        StageManager.idle();
      }
    }
  }, {
    key: "timer",
    get: function get() {
      return this._timer;
    }
  }]);

  return PointAndClick;
}();

var OwlEyes = function () {
  function OwlEyes(data) {
    _classCallCheck(this, OwlEyes);

    this._data = data;
    this._selected = [null];
    this._submitted = false;
  }

  _createClass(OwlEyes, [{
    key: "draw",
    value: function draw(stage) {
      switch (this._data.view) {
        case "student":
          new BackgroundImage(stage, this._data.bg);
          this._timer = new Timer(stage, this._data.time, this.submit.bind(this));
          new DifficultyMeter(stage, this._data.difficulty);
          new Title(stage, this._data.text);
          new AnswerCycle(stage, this._data.answers, this.selected.bind(this));
          new StopButton(stage, this.submit.bind(this));
          break;
        case "projector":
          new BackgroundImage(stage, this._data.bg);
          this._timer = new Timer(stage, this._data.time, null);
          new DifficultyMeter(stage, this._data.difficulty);
          new Title(stage, this._data.text);
          new AnswerCycle(stage, this._data.answers, null);
          new StopButton(stage, null);
          break;
      }
    }
  }, {
    key: "selected",
    value: function selected(value) {
      this._selected = value;
    }
  }, {
    key: "submit",
    value: function submit() {
      if (this._submitted) return;
      var obj = JSON.parse('{' + '"cmd" : "submit",' + '"activity" : "' + this._data.activity + '",' + '"id" : ' + this._data.id + ',' + '"selected" : ' + JSON.stringify(this._selected[0]) + '}');
      if (ServerConnection.send(obj)) {
        this._submitted = true;
        StageManager.idle();
      }
    }
  }, {
    key: "timer",
    get: function get() {
      return this._timer;
    }
  }]);

  return OwlEyes;
}();

window.addEventListener('resize', resize, false);

function init() {
  ServerConnection.init("example.lu/rest/");
  StageManager.init("canvas"); // ID of canvas

  StageManager.idle();
  resize();
}

function resize() {
  StageManager.resize(true);
}