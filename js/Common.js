/**
* Common functions
*/
class Common {

  static getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static removeTweens(displayObject, removePersistant) {
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

}
