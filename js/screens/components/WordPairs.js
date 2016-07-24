class WordPairs {
  constructor(answers, onChange) {
    this._answers = answers;
    this._line = new createjs.Shape();
    this._connections = new createjs.Shape();
    this._connectMap = {};
    this._panelDictionary = [];
    this._onChange = onChange;
  }

  addTo(container) {
    container.name = "WordPairs";

    this.redrawConnections();

    let pLeft = this._answers[0];
    let pRight = this._answers[1];

    let panelHeight = container.height * 0.4;
    let wordHeight = panelHeight / pLeft.length;

    let panelLeft = this.createWordPanel(wordHeight, pLeft, "left");
    panelLeft.x = - container.width * 0.1;
    panelLeft.y = - panelHeight / 2;

    let panelRight = this.createWordPanel(wordHeight, pRight, "right");
    panelRight.x = container.width * 0.1;
    panelRight.y = - panelHeight / 2;

    container.addChild(panelLeft, panelRight, this._connections, this._line);
  }

  createWordPanel(height, words, anchor) {
    let wordPanel = new createjs.Container();
    for(let i = 0; i < words.length; i++) {
      let word = words[i];
      let label = this.createLabel(height, word, anchor);
      label.y += i * height;

      let padding = height / 5;
      let labelWidth = label.getMeasuredWidth() + padding;
      let labelHeight = label.getMeasuredHeight() + padding;

      let panel = this.createPanel(labelWidth, labelHeight, padding, word, anchor)
      panel.y += i * height;

      wordPanel.addChild(panel, label);
    }
    return wordPanel;
  }

  createLabel(height, value, anchor) {
    let fontSize = height * 0.5;
    let label = new createjs.Text();
    label.text = value.toString();
    label.font = `${fontSize}px Dimbo`;
    label.color = "#f0261b";
    if(anchor === "left") {
      label.textAlign = "right";
    } else {
      label.textAlign = "left";
    }

    label.textBaseline = "middle";

    return label;
  }

  createPanel(labelWidth, labelHeight, padding, value, anchor) {
    let labelPanel = new createjs.Shape();
    labelPanel.text = value.toString();
    labelPanel.anchor = anchor;
    labelPanel.graphics.beginFill("#d3d3d3").drawRect(0, 0, labelWidth, labelHeight);
    labelPanel.connectPoint = anchor === "left" ?  [labelWidth, labelHeight / 2] : [0, labelHeight / 2];
    if(anchor === "left") {
      labelPanel.x = - labelWidth + padding / 2;
      labelPanel.y = - labelHeight / 2;
    } else {
      labelPanel.x = - padding / 2;
      labelPanel.y = - labelHeight / 2;
    }

    if(this._onChange != undefined) {
      labelPanel.on("mouseover", handleMouseOver.bind(this));
      labelPanel.on("mouseout", handleMouseOut.bind(this));
      labelPanel.on("mousedown", handleMouseDown.bind(this));
      labelPanel.on("pressmove", handlePressMove.bind(this));
      labelPanel.on("pressup", handlePressUp.bind(this));
    }

    function handleMouseOver(event) {
      event.target.filters = [ new createjs.ColorFilter(1,1,1,1,-25,-25,-25,0) ];
      event.target.cache(0, 0, event.target.graphics.command.w, event.target.graphics.command.h);
      this._hoveredPanel = event.target;
    }

    function handleMouseOut(event) {
      event.target.filters = [ new createjs.ColorFilter(1,1,1,1,0,0,0,0) ];
      event.target.cache(0, 0, event.target.graphics.command.w, event.target.graphics.command.h);
      this._hoveredPanel = null;
    }

    function handleMouseDown(event) {
      this._selectedPanel = event.target;
    }

    function handlePressMove(event) {
      let pConnect = this._selectedPanel.connectPoint;
      let line = this._line;
      let pOrigin = this._selectedPanel.localToLocal(pConnect[0], pConnect[1], line);
      let pDest = line.globalToLocal(event.rawX, event.rawY);

      line.graphics.clear().setStrokeStyle(3).beginStroke("black")
        .moveTo(pOrigin.x, pOrigin.y)
        .lineTo(pDest.x, pDest.y)
        .endStroke();
    }

    function handlePressUp(event) {
      // mimik mouse
      if(event.isTouch) {
        this._hoveredPanel = null;
        for(let label in this._panelDictionary) {
          let panel = this._panelDictionary[label];
          let touchPos = panel.globalToLocal(event.rawX, event.rawY);
          if(panel.hitTest(touchPos.x, touchPos.y)) {
            this._hoveredPanel = panel;
            break;
          }
        }
      }

      if(this._hoveredPanel != null
        && this._hoveredPanel.anchor != this._selectedPanel.anchor) {
          let pairLeft = this._selectedPanel.anchor === "left" ? this._selectedPanel.text : this._hoveredPanel.text;
          let pairRight = this._selectedPanel.anchor === "right" ? this._selectedPanel.text : this._hoveredPanel.text;

          for(let word in this._connectMap) {
            if(this._connectMap[word] === pairRight) {
              delete this._connectMap[word];
              this.redrawConnections();
              break;
            }
          }

          this._connectMap[pairLeft] = pairRight;
          this.redrawConnections();

      }
      this._selectedPanel = null;
      this._line.graphics.clear();
      this._onChange(this._connectMap);
    }

    this._panelDictionary[labelPanel.text] = labelPanel;
    return labelPanel;
  }

  drawConnection(p1, p2) {
    p1 = this._panelDictionary[p1];
    p2 = this._panelDictionary[p2];
    let connections = this._connections;
    let pOrigin = p1.localToLocal(p1.connectPoint[0], p1.connectPoint[1], connections);
    let pDest = p2.localToLocal(p2.connectPoint[0], p2.connectPoint[1], connections);

    connections.graphics.setStrokeStyle(3).beginStroke("black")
      .moveTo(pOrigin.x, pOrigin.y)
      .lineTo(pDest.x, pDest.y)
      .endStroke();
  }

  redrawConnections() {
    this._connections.graphics.clear();
    for(let connection in this._connectMap) {
      this.drawConnection(connection, this._connectMap[connection]);
    }
  }

}
