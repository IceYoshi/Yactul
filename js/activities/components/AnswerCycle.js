class AnswerCycle {
  constructor(screen, answers, callback) {
    if(answers.length > 0) {
      // cyclic answer label
      var cycleLabel = new createjs.Text(answers[0], "bold 30px Arial", "#000000");
      cycleLabel.x = screen.width / 2;
      cycleLabel.y = screen.height * 0.4;
      cycleLabel.textAlign = "center";

      if(callback != null) callback([answers[0]]);
      var sleepTime = 1500;
      update(0);

      function update(i) {
        createjs.Tween.get(cycleLabel)
          .to({ text: answers[i] } )
          .wait(sleepTime)
          .call(handleComplete, [callback]);
        function handleComplete(callback) {
          if(++i >= answers.length) i = 0;
          if(callback != null) callback([answers[i]]);
          update(i);
        }
      }
      screen.addChild(cycleLabel);

    }
  }
}
