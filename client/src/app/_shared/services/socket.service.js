;(function() {

  'use strict';

  /**
   * Socket.IO service
   */

  angular
    .module('boilerplate')
    .service('socket', SocketFactory);

  SocketFactory.$inject = ['$rootScope'];

  function SocketFactory($rootScope) {
    var socket;
    this.on = on;
    this.emit = emit;
    this.disconnect = disconnect;

    connect();

    /// definitions

    /**
     * Connect to Socket.IO server
     */
    function connect() {
      // console.log(io)
      if (!socket)
        socket = io.connect('http://localhost:5000/');
        if(socket !== undefined){
              console.log('Connected to socket...', socket);
        }
    }

    /**
     * Listen on socket event
     */
    function on(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    }

    /**
     * Emit event with data
     */
    function emit(eventName, data, callback) {
      console.log('emitting', eventName, data);
      

      socket.emit(eventName, data, function() {
        console.log(socket)
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback)
            callback.apply(socket, args);
        });
      });
    }

    /**
     * Disconnect socket connection
     */
    function disconnect() {
      socket.disconnect();
    }
  }

})();
