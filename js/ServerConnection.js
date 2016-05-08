class ServerConnection {
  static send(data) {
    console.log('To server: ' + JSON.stringify(data));
    if(typeof sendJSON == 'function') {
        sendJSON(data);
    }

    return true;
  }

  static receive(data) {
    console.log('From server: ' + JSON.stringify(data));
    MessageInterpreter.interpret(data);

    return true;
  }

}
