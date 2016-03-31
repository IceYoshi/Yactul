class ServerConnection {
  static init(serverAddress) {
    this._server = serverAddress;
    this._isInitialized = true;
  }

  static send(data) {
    if(!this._isInitialized) return false;
    
    // TODO: send data to server
    console.log('To server: ' + JSON.stringify(data));

    return true;
  }

  static receive(data) {
    if(!this._isInitialized) return false;

    console.log('From server: ' + JSON.stringify(data));
    MessageInterpreter.interpret(data);

    return true;
  }

}
