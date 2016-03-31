class Timer {
  constructor(screen, time, callback) {
    // convert time into an int if decimal
    time = Math.max(Math.floor(time), 1);

    // timer background
    var bgCircle = new createjs.Shape();
    bgCircle.graphics.beginFill("#d3d3d3").drawCircle(0, 0, screen.width / 8);
    bgCircle.x = screen.width;
    bgCircle.y = 0;

    // timer label
    var timeLabel = new createjs.Text(time.toString(), "bold 45px Arial", "#F0261B");
    timeLabel.textBaseline = "alphabetic";
    timeLabel.x = screen.width - screen.width / 20;
    timeLabel.y = screen.width / 16;
    timeLabel.lineWidth = screen.width / 8;
    timeLabel.textAlign = "center";

    // time in ms per timer tick
    var tickTime = 1000;

    // Date is used to calculate the real time passed between each tick. It makes the timer more accurate.
    var date = new Date(new Date().getTime() - tickTime);
    update(time);

    // update timer label. It recalls itself recursively after each tickTime until time has reached 0.
    function update(time) {
      var sleepTime = tickTime - (new Date().getTime() - date.getTime() - tickTime);
      date = new Date();
      createjs.Tween.get(timeLabel)
        .to({ text: time.toString() } )
        .wait(sleepTime)
        .call(handleComplete, [callback]);
      function handleComplete(callback) {
          if(time > 0) {
            time--;
            if(time == 0 && callback != null) callback();
            update(time);
          }
      }
    }

    // progress arc
    var progressArc = new createjs.Shape();
    progressArc.graphics.setStrokeStyle(10).beginStroke("#F0261B").arc(screen.width, 0, screen.width / 8, Math.PI/2, Math.PI);
    progressArc.x = progressArc.regX = screen.width;
    progressArc.y = progressArc.regY = 0;

    // progress arc animation
    createjs.Tween.get(progressArc, { loop: false })
      .to({ rotation: -90 }, time*1000, createjs.Ease.getPowInOut(1));


    screen.addChild(bgCircle);
    screen.addChild(progressArc);
    screen.addChild(timeLabel);
  }

}
