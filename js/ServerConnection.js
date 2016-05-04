class ServerConnection {
  static init(serverAddress) {
    if(serverAddress) {
      let socket = new WebSocket(serverAddress);

      socket.onopen = function() { console.log("Socket connection opened"); };
      socket.onmessage = function(event) {
        this.receive(JSON.parse(event.data));
      }.bind(this);
      socket.onclose = function() { console.log("Socket connection closed"); };

      this._socket = socket;
    } else {
      console.log("No socket destination address. Proceeding at localhost");
    }

    this._isInitialized = true;
  }

  static send(data) {
    if(!this._isInitialized) return false;
    console.log('To server: ' + JSON.stringify(data));
    if(this._socket) this._socket.send(JSON.stringify(data));

    return true;
  }

  static receive(data) {
    if(!this._isInitialized) return false;
    console.log('From server: ' + JSON.stringify(data));
    MessageInterpreter.interpret(data);

    return true;
  }

}
