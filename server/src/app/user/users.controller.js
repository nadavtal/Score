;(function() {

  'use strict';

  /**
   * Users endpoint controller
   * @desc Handler functions for all /users routes
   */
  var mongoose = require('mongoose');
  var ObjectId = mongoose.Types.ObjectId;
  var User = require('./user.model.js');

  var bcrypt = require('bcryptjs');
  var SALT_WORK_FACTOR = 10;
  var jwt = require('jsonwebtoken');
  var config = require('../../config/config.js');
  var utils = require('../utils/utils.js');
  var request = require("request");

  // public
  module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    changePassword,
    authenticate,
    verifyToken,
    isAdmin,
    
    
    
   
  };

  

  

  

  
  /// definitions

  /**
   * Authenticate user
   * POST '/users/authenticate'
   */
  function authenticate(req, res, next) {
    console.log('authenticating')
    var params = req.body;
    var pass = params.password;
    var authErrMsg = {
      message: 'Authentication failed. Wrong userName or password.',
      code: 'wrongCredentials',
      status: 401
    };

    User
      .findOne({ userName: params.userName })
      .exec((err, user) => {
        if (err) return next({ err: err, status: 401 });
        if (!user) return next(authErrMsg);

        // test a matching password
        user.comparePassword(pass, (err, isMatch) => {
          if (err || !isMatch) return next(authErrMsg);
          console.log('user after authentication', user)
          var userInfo =  {
            _id: user._id,
            userName: user.userName,
            createdAt: user.createdAt,
            role: user.role,
            email: user.email,
            surname: user.surname,
            firstName: user.firstName,
            wins: user.wins,
            friends: user.friends,
            groups: user.groups,
            accounts: user.accounts,
            messages: user.messages,
            gamesHistory: user.gamesHistory

          };
          // console.log(user)
          var token = jwt.sign({
            _id: user._id,
            userName: user.userName,
            role: user.role,
            email: user.email,
            surname: user.surname,
            firstName: user.firstName,
          }, config.secret, {
            expiresIn: '24h'
          });
          // console.log('token', token)

          userInfo.token = token;

          // just to prove sockets are working, there are better use cases for using websockets
          req.io.emit('user:loggedIn');

          utils.sendJSONresponse(res, 200, userInfo);
        });
      });
  }

  function verifyToken(req, res, next) {
    // console.log(req.headers)
    
    var token = req.headers['authorization'] || req.body.token;
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length).trimLeft();
    }
    console.log(token)
    if (token) {
      
      jwt.verify(token, config.secret, (err, decodedToken) => {
        console.log(decodedToken)
        if (err){
          // console.log(err)
          return next({
            status: 401,
            message: 'Failed to authenticate token.',
            name: 'unauthorized'
          });

        }

        User
          .findOne({ _id: decodedToken._id }, { password: 0 })
          .lean()
          .exec((err, user) => {
            if (err) return next({ err: err, status: 400 });
            if (!user) return next({ message: 'User not found in verifyToken function.', status: 404 });

            // token ok, save user onto request object for use in other routes
            req.user = user;
            next();
          });
      });

    } else {
      return next({
        status: 401,
        message: 'Failed to authenticate token.',
        name: 'unauthorized'
      });
    }
    
  }

  /**
   * Create new user
   * POST '/users'
   */
  function createUser(req, res, next) {
    console.log('creating user')
    var params = req.body;
    var user = new User({
      userName: params.userName,
      firstName: params.firstName,
      surname: params.surname,
      password: params.password,
      email: params.email,
      role: params.role,
      profileImageFileName: params.filename,
      profileImageLink: params.profileImageLink
    });
    console.log(user)
    // req params validation for required fields
    req.checkBody('userName', 'Username must be defined').notEmpty();
    req.checkBody('password', 'Password must be defined').notEmpty();
    req.checkBody('email', 'Email must be defined').notEmpty();

    // validate user input
    var errors = req.validationErrors();
    if (errors) {
        utils.sendJSONresponse(res, 400, errors);
        return;
    }

    user.save((err, newUser) => {
      console.log('saving user', newUser)
      if (err) return next({ err: err, status: 400 });
      if (!newUser) return next({ message: 'User not created.', status: 400 });

      utils.sendJSONresponse(res, 201, newUser);
    });
  }

  /**
   * Get users (paginated)
   * GET '/users/'
   */
  function getUsers(req, res, next) {
    console.log('getting users')
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;

    var options = {
        offset: 0,
        page: 1,
        limit: 100,
        lean: true
    };
    

    User.paginate({}, options, (err, users) => {
      console.log('paginating')
      if (err) return next(err);
      if (!users) return next({
        message: 'No users found.',
        status: 404
      });

      var pagination = {
        pageNumber: users.page,
        itemsPerPage: users.limit,
        prev: res.locals.paginate.href(true),
        next: res.locals.paginate.href(),
      };

      utils.sendJSONresponse(res, 200, users, false, pagination);
    });
  }

  /**
   * Get user
   * GET '/users/:userId'
   */
  function getUser(req, res, next) {
    var params = req.params;

    User
      .findOne({ '_id': ObjectId(params.userId) }, { password: 0, __v: 0 })
      .exec((err, user) => {
        if (err) return next(err);
        if (!user) return next({
          message: 'User not found.',
          status: 404
        });
        // console.log(res)
        utils.sendJSONresponse(res, 200, user);
      });
  }

  /**
   * Update user
   * PUT '/users/:userId'
   */
  function updateUser(req, res, next) {
    var bodyParams = req.body;
    var currentUser = req.user;
    console.log('currentUser: ', currentUser)
    console.log('body params: ', bodyParams)
    User
      .findOneAndUpdate(
        { _id: ObjectId(bodyParams._id) },
        { '$set': {
          'userName' : bodyParams.userName,
          'firstName': bodyParams.firstName,
          'surname': bodyParams.surname,
          'email': bodyParams.email,
          'role': bodyParams.role,
          'wins' : bodyParams.wins,
          'gamesplayed' : bodyParams.gamesplayed,
          'accounts': bodyParams.account,
          'friends' : bodyParams.friends,
          'profileImageFileName': bodyParams.profileImageFileName,
          'profileImageLink': bodyParams.profileImageLink
          }
        },
        { upsert: false, new: true, fields: { password: 0 }, runValidators: true, setDefaultsOnInsert: true })
      .exec((err, user) => {
        console.log('returnedUser', user)
        if (err) return next({ err: err, status: 400 });
        if (!user) return next({
          message: 'User not found.',
          status: 404
        });

        utils.sendJSONresponse(res, 200, user);
      });
  }


  /**
   * Change password
   * PUT '/users/change-password'
   */
  function changePassword(req, res, next) {
    var bodyParams = req.body;
    var currentUser = req.user;

    req.checkBody('password', 'Password must be defined').notEmpty();
    req.checkBody('confirmPassword', 'Confirmed password must be defined').notEmpty();
    req.checkBody('confirmPassword', 'Password and confirm password does not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        utils.sendJSONresponse(res, 400, errors);
        return;
    }

    User
      .findOneAndUpdate(
        { _id: ObjectId(currentUser._id) },
        { '$set': {
          'password': bcrypt.hashSync(bodyParams.password, SALT_WORK_FACTOR),
          }
        },
        { upsert: false, new: true })
      .exec((err, user) => {
        if (err) return next({ err: err, status: 400 });
        if (!user) return next({
          message: 'User not found.',
          status: 404
        });

        utils.sendJSONresponse(res, 204, {});
      });
  }

  /**
   * Verify JWT token
   */
  

  /**
   * Middleware for checking if user is admin
   */
  function isAdmin(req, res, next) {
    var user = req.user;
    var isAdmin = user && user.role === 'admin';

    if (isAdmin)
      next();
    else
      return next({
        status: 403,
        message: 'Forbidden access',
        name: 'forbiddenaccess'
      });
  }

})();
