class TooltipInfo {
  constructor(tooltip) {
    this._size = 25;
    this._tooltip = tooltip;
  }

  addTo(container) {
    container.name = "TooltipInfo";

    if(!this._infoIcon) this._infoIcon = this.createInfoIcon(this._tooltip);

    container.addChild(this._infoIcon);
  }

  createInfoIcon(tooltip) {
    let template = document.createElement('template');
    template.innerHTML = `<div style="position:absolute; top:${document.getElementById('header').offsetHeight}px; left:0" rel="tooltip" title="${tooltip}"><img src="img/info.png" width="${this._size}px" height="${this._size}px"/></div>`;

    template = template.content.firstChild;

    $("#placeholder").append(template);

    $(document).ready(function(){
      initTooltip();
    });

    let iconObject = new createjs.DOMElement(template);
    iconObject.x -= this._size*5;

    return iconObject;
  }


}
