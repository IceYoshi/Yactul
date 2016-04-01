class MessageInterpreter {
  static interpret(data) {
    switch(data.cmd) {
      case "start":
          StageManager.draw(this.getActivity(data));
        break;
      case "change":
          StageManager.change(data);
        break;
      case "interrupt":
          StageManager.interrupt();
        break;
      default: console.log('Error: Unknown command ' + data.cmd);
    }
  }

  static getActivity(data) {
    try {
      return eval('(new ' + data.activity + '(data))');
    } catch (e) {
        console.log('ReferenceError: Class ' + data.activity + ' is not defined.');
    }

    // Fallback, needed when the js code gets compressed
    try {
      return eval('(' + data.activity + '(data))');
    } catch (e) {
      console.log('ReferenceError: Function ' + data.activity + ' is not defined.');
      return null;
    }
  }
}
