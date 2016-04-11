class MessageInterpreter {
  static interpret(data) {
    switch(data.cmd) {
      case "start":
          StageManager.draw(this.getActivity(data));
        break;
      case "update":
          StageManager.updateTimer(data);
        break;
      case "pause":
          StageManager.pauseTimer();
        break;
      case "resume":
          StageManager.resumeTimer();
        break;
      case "abort":
          StageManager.abort();
        break;
      default: console.log('Error: Unknown command ' + data.cmd);
    }
  }

  static getActivity(data) {
    try {
      return eval('(new ' + data.activity + '(data))');
    } catch (e) {
      // Fallback, needed when the js code gets compressed (class->function convertion)
      try {
        return new window[data.activity](data);
      } catch (e) {
        console.log('ReferenceError: Activity ' + data.activity + ' is not defined.');
        return null;
      }
    }
  }
}
