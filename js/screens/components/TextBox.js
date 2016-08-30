class TextBox {
  constructor(submit) {
    this._submit = submit;
  }

  addTo(container) {
    container.name = "TextBox";

    if(!this._textBox) this._textBox = this.createTextBox(container.width);

    this._textBox.x = - this._textBox.htmlElement.offsetWidth / 2;

    container.addChild(this._textBox);
  }

  createTextBox(width) {
    let template = document.createElement('template');
    template.innerHTML = `<div class="form-group" id="textBox" style="width:60%; top:${document.getElementById('header').offsetHeight}px; left:0"><input class="form-control input-lg" type="text" placeholder="Enter suggestion"></div>`;

    template = template.content.firstChild;

    $("#placeholder").append(template);

    template.addEventListener("keydown", function(event) {
      if(event.keyCode == 13) { //Enter key has been pressed
        let input = template.getElementsByTagName('input')[0];
        if(input.value){
          this._submit(input.value);
          input.value = "";
          let template2 = document.createElement('template');
          template2.innerHTML = `<label id="submitInfoLabel" style="position:absolute; top:-30px; left:0; color:#f0261b;">Submitted!</label>`;
          template2 = template2.content.firstChild;

          $("#textBox").prepend(template2);
          $("#submitInfoLabel").hide();
          $("#submitInfoLabel").show("drop", {}, 500, function() {
            setTimeout(function() {
              $("#submitInfoLabel").fadeOut();
              setTimeout(function() {
                $("#submitInfoLabel").remove();
              }, 500);
            }, 1500 );
          });
        }
      }
    }.bind(this));

    return new createjs.DOMElement(template);
  }


}
