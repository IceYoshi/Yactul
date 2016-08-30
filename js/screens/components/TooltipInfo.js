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
    template.innerHTML = `<img src="img/info.png" width="${this._size}px" height="${this._size}px" style="position:absolute; top:${document.getElementById('header').offsetHeight}px; left:0" rel="tooltip" data-placement="bottom" title="${tooltip}" />`;

    template = template.content.firstChild;

    $("#placeholder").append(template);

    $(document).ready(function(){
      $('[rel="tooltip"]').tooltip();
    });

    let iconObject = new createjs.DOMElement(template);
    iconObject.x -= this._size;

    return iconObject;
  }


}
