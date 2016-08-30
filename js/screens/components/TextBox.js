class TextBox {
  constructor() {
  }

  addTo(container) {
    container.name = "TextBox";

    if(!this._textBox) this._textBox = this.createTextBox(container.width);

    this._textBox.x = - this._textBox.htmlElement.offsetWidth / 2;

    container.addChild(this._textBox);
  }

  createTextBox(width) {
    let template = document.createElement('template');
    template.innerHTML = `<div class="form-group" style="width:60%; top:${document.getElementById('header').offsetHeight}px; left:0"><input class="form-control input-lg" type="text" placeholder="Enter suggestion"></div>`;

    template = template.content.firstChild;

    $("#placeholder").append(template);

    template.addEventListener("keydown", function(event) {
      alert(event.keyCode + " " + event.key);
    });

    return new createjs.DOMElement(template);
  }


}
