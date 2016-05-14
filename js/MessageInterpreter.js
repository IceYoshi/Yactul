/**
* The role of the MessageInterpreter is to convert a string (case sensitive)
* into the according screen instance.
* If there is no screen class with the same name, a console message is written
* and the screen draw request is ignored.
*/
class MessageInterpreter {
  static interpret(data) {
    switch(data.cmd) {
      case "show":
          StageManager.draw(this.getScreen(data));
        break;
      case "update":
          StageManager.update(data);
        break;
      default: console.log('Error: Unknown command ' + data.cmd);
    }
  }

  static getScreen(data) {
    try {
      return eval('(new ' + data.screen + '(data))');
    } catch (e) {
      // Fallback when in compatibility mode (ES6 -> ES5/ES3)
      try {
        return new window[data.screen](data);
      } catch (e) {
        console.log('ReferenceError: Screen ' + data.screen + ' is not defined.');
        return null;
      }
    }
  }
}
