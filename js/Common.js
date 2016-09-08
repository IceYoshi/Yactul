/**
* Common functions
*/
class Common {

  static replaceLastClass(htmlElement, classID) {
    let cList = htmlElement.classList;
    cList.remove(cList[cList.length - 1]);
    cList.add(classID);
  }

  static toClassID(classID) {
    return "c" + classID;
  }

  static getRandomNumber(min, max, rndFunction) {
    if(rndFunction == undefined) rndFunction = Math.random;
    return Math.floor(rndFunction() * (max - min + 1) + min);
  }

  static removeTweens(displayObject, removePersistant) {
    if(!displayObject) return;
    if(displayObject.numChildren) {
      for(let i = 0; i < displayObject.numChildren; i++) {
        Common.removeTweens(displayObject.getChildAt(i), removePersistant);
      }
    }

    if(!displayObject.persistant || removePersistant) {
      createjs.Ticker.removeEventListener("tick", displayObject);
      createjs.Tween.removeTweens(displayObject);
    }
  }

  static removeHTMLElements(displayObject) {
    if(!displayObject) return;
    if(displayObject.numChildren) {
      for(let i = 0; i < displayObject.numChildren; i++) {
        Common.removeHTMLElements(displayObject.getChildAt(i));
      }
    }

    $(`#placeholder .${Common.toClassID(displayObject.id)}`).remove();
  }

}
