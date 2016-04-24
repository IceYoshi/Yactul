class Title {
  constructor(screen, question) {
    var width = screen.width * 0.75;
    var height = screen.height / 13;
    var paddingTop = screen.height * 1.5 / 10;
    var paddingLeft = (screen.width - width) / 2;
    var paddingRect = height / 4;

    // question multiline label
    var questionLabel = new createjs.Text(question, "30px Dimbo", "#F0261B");
    questionLabel.x = screen.width / 2;
    questionLabel.y = paddingTop + height/2;
    questionLabel.lineWidth = width - width / 15;
    questionLabel.lineHeight = height;
    questionLabel.textAlign = "center";
    questionLabel.textBaseline = "middle";

    var numOfLines = questionLabel.getMeasuredHeight() / height;

    // background question rounded rectangle
    var questionRect = new createjs.Shape();
    questionRect.graphics.beginFill("#d3d3d3").drawRoundRect(0, 0, width, height * numOfLines + paddingRect * 2, height / 2);
    questionRect.x = paddingLeft;
    questionRect.y = paddingTop - paddingRect;

    screen.addChild(questionRect);
    screen.addChild(questionLabel);
  }

}
