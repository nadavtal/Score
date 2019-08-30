;(function() {

  'use strict';

  var express = require('express');
  var config = require('../config/config.js');
  var utils = require('./utils/utils.js');

  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var compression = require('compression');
  var helmet = require('helmet');
  var methodOverride = require('method-override');
  var paginate = require('express-paginate');
  var cors = require('cors');
  var expressValidator = require('express-validator');
 
  var Message = require('./message/message.model.js');
  var errorHandling = require('./app.error-handling.js');

  /**
   * MongoDB init
   */
  var db = require('../config/db.js');

  /**
   * ExpressJS app init
   */
  var app = express();
  var http = require('http');
  var server = http.Server(app);

  /**
   * Socket.Io init
   */
  // socket.io server url: http://localhost:5000
  var users = [];
  var connections = [];
  // console.log(server)
  var io = require('socket.io')(server);
  io.sockets.on('connection', (socket) => {
    // console.log(db)
    connections.push(socket);
    console.log('connected: %s sockets connected', connections.length);

    
  
          
    //     });
    // //function to send status
    var sendStatus = function(s){
      socket.emit('status', s)
    }

    socket.on('userLoggedIn', function(data){
      console.log('userLoggedInData', data);
      Message
        .find({$or:[{'receiver.userId':  data.currentUser._id,
                      'sender.userId': data.user.userId}, 
                    {'receiver.userId' : data.user.userId,
                     'sender.userId': data.currentUser._id}]})
        .exec((err, messages) => {
          if (err) return next(err);
          if (!messages) return next({
            message: 'message not found.',
            status: 404
          });

          socket.emit('messages', messages);

      });
    });

    socket.on('groupLoggedIn', function(data){
      console.log('groupLoggedInData', data.messageType, data.group._id);
      Message
        .find({ 
                'receiver.userId' : data.group._id}
                  )
        .exec((err, messages) => {
          if (err) return next(err);
          if (!messages) return next({
            message: 'message not found.',
            status: 404
          });

          socket.emit('messages', messages);

      });
    });

    socket.on('input', function(data){
      console.log('input data: ', data);
      var message = new Message({
        subject : '',
        content: data.message,
        messageType : data.messageType,
        sender : data.sender,
        receiver : data.receiver,
        
  
        
      });
      console.log(message)
        
      message.save((err, newMessage) => {
        console.log('saving message', newMessage)
        if (err) return next({ err: err, status: 400 });
        if (!newMessage) return next({ message: 'Message not created.', status: 400 });
        socket.emit('output', newMessage);
        sendStatus({
                message: 'Message sent', 
                clear: true
              })
        
      });
      
    })

    //handle clear
    socket.on('clear', function(data){
      //Remove all chats from collection
      

      socket.emit('cleared')
      
    })

    socket.on('typing', function(data){
      // console.log('typing')
      sendStatus(data.user.userName + ' is typing...')
    })



    socket.on('disconnect', (socket) => {
      connections.splice(connections.indexOf(socket), 1);
      console.log('disconnected: %s sockets connected', connections.length);
      
    });
    socket.on('error', function(e){
        console.log(e);
    });
  });
  console.log(__dirname)
  // app.use(express.static(path.join(__dirname, 'src')));
  // make io accessible for all routes
  app.use((req,res,next) => {
      req.io = io;
      next();
  });

  

  /**
   * Middleware section
   */
  app.use(cors());
  app.use(compression());
  app.use(helmet());
  app.use(methodOverride('X-HTTP-Method-Override'));
  app.use(methodOverride('_method'));
  /**
   * express pagination, include pagination links in response
   * keep this before all routes that will use pagination
   * 10 - max limit per page
   * 100 - max limit user can send in query
   */
  app.use(paginate.middleware(10, 100));

  app.use(bodyParser.text());
  app.use(bodyParser.json());
  
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(expressValidator());
  app.use(cookieParser());

  /**
   * Router
   */
  var routes = require('./app.routes.js');
  app.use(config.apiRoute, routes);

  /**
   * Error handling
   */

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    errorHandling.routeNotFound(req, res, next);
  });


  // development error handling with stacktraces
  if (app.get('env') === 'development' || app.get('env') === 'test') {
    app.use((err, req, res, next) => {
      errorHandling.dev(err, req, res, next, app, utils);
    });
  }

  // production error handling no stacktraces
  app.use((err, req, res, next) => {
    errorHandling.prod(app, utils, err, req, res, next);
  });

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    next()
  })

  // start the app by listening on <port>
  var env = process.env.NODE_ENV || 'development';
  var port = config.db[env].port || 5000;

  // don't start up server for tests
  if (!module.parent) {
    server.listen(port, () => {
      console.log(`Express server listening on port ${port} in ${app.settings.env} mode`);
    });
  }

  module.exports = app;

})();
