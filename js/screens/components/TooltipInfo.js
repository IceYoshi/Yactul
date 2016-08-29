class TooltipInfo {
  constructor(tooltip) {
    this._size = 30;
    this._tooltip = tooltip;
  }

  addTo(container) {
    container.name = "TooltipInfo";

    if(!this._infoIcon) this._infoIcon = this.createInfoIcon(this._tooltip);

    container.addChild(this._infoIcon);
  }

  createInfoIcon(tooltip) {
    let template = document.createElement('template');
    template.innerHTML = `<img src="img/info.png" width="30" height="30" style="position:absolute; top:${document.getElementById('header').offsetHeight}px; left:0" data-toggle="tooltip" data-placement="bottom" title="${tooltip}" />`;

    template = template.content.firstChild;
    document.body.appendChild(template);

    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
    });

    let iconObject = new createjs.DOMElement(template);
    iconObject.x -= 30;

    return iconObject;
  }


}
