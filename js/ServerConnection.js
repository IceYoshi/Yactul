/**
* Interchange point between server and client. Any messages send or received
* will go through the coresponding intersepter method
*/
class ServerConnection {
  static send(data) {
    // TODO This console print can be removed once this product goes to production
    console.log('To server: ' + JSON.stringify(data));

    // Check if sendJSON function exists. This should be the case if
    // this project is correctly bound to a server. However, in order
    // to test it independently from the server, this step can be skipped.
    if(typeof sendJSON == 'function') {
        sendJSON(data);
    }

    return true;
  }

  static receive(data) {
    // TODO This console print can be removed once this product goes to production
    console.log('From server: ' + JSON.stringify(data));
    
    MessageInterpreter.interpret(data);

    return true;
  }

}
