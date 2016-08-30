class TooltipInfo {
  constructor(tooltip) {
    this._size = 25;
    this._padding = 5;
    this._tooltip = tooltip;
  }

  addTo(container) {
    container.name = "TooltipInfo";

    if(!this._infoIcon) this._infoIcon = this.createInfoIcon(this._tooltip);

    container.addChild(this._infoIcon);
  }

  createInfoIcon(tooltip) {
    let infoHTML = document.createElement('template');
    infoHTML.innerHTML = `<div style="padding:${this._padding}px; position:absolute; top:${document.getElementById('header').offsetHeight}px; left:0" rel="tooltip" title="${tooltip}"><img src="img/info.png" width="${this._size}px" height="${this._size}px"/></div>`;

    infoHTML = infoHTML.content.firstChild;

    $("#placeholder").append(infoHTML);

    $(document).ready(function(){
      initTooltip();
    });

    let iconObject = new createjs.DOMElement(infoHTML);
    iconObject.x = - this._size - this._padding;
    iconObject.y = - this._padding;

    return iconObject;
  }


}
