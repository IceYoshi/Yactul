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
    let inputHTML = document.createElement('template');
    inputHTML.innerHTML = `<div class="form-group" id="textBox" style="width:60%; top:${document.getElementById('header').offsetHeight}px; left:0"><input class="form-control input-lg" type="text" placeholder="Enter suggestion"></div>`;
    inputHTML = inputHTML.content.firstChild;

    $("#placeholder").append(inputHTML);

    inputHTML.addEventListener("keydown", function(event) {
      if(event.keyCode == 13) { //Enter key has been pressed
        let input = inputHTML.getElementsByTagName('input')[0];
        if(input.value){
          this._submit(input.value);
          input.value = "";
          let submitInfoHTML = document.createElement('template');
          submitInfoHTML.innerHTML = `<label id="submitInfoLabel" style="padding-left:20px; position:absolute; top:-30px; left:0; color:#f0261b;">Submitted!</label>`;
          submitInfoHTML = submitInfoHTML.content.firstChild;

          $("#textBox").append(submitInfoHTML);
          $("#submitInfoLabel").hide();
          $("#submitInfoLabel").show("drop", {}, 500, function() {
            setTimeout(function() {
              $("#submitInfoLabel").fadeOut();
              setTimeout(function() {
                $("#submitInfoLabel").remove();
              }, 400);
            }, 1500 );
          });
        }
      }
    }.bind(this));

    return new createjs.DOMElement(inputHTML);
  }


}
