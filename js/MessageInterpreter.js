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
        return new window[data.activity](data);
      } catch (e) {
        console.log('ReferenceError: Screen ' + data.screen + ' is not defined.');
        return null;
      }
    }
  }
}
