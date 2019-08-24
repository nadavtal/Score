;(function() {

  'use strict';

  /**
   * Users endpoint controller
   * @desc Handler functions for all /users routes
   */
  var mongoose = require('mongoose');
  var ObjectId = mongoose.Types.ObjectId;
  var Group = require('./group.model.js');

  var bcrypt = require('bcryptjs');
  var SALT_WORK_FACTOR = 10;
  var jwt = require('jsonwebtoken');
  var config = require('../../config/config.js');
  var utils = require('../utils/utils.js');


  // public
  module.exports = {
    createGroup,
    getAllGroups,
    getGroupsByUserId,
    getGroup,
    // getUser,
    updateGroup,
    // changePassword,
    
    // isAdmin,
  };

  /// definitions

  /**
   * Authenticate user
   * POST '/users/authenticate'
   */
  function authenticate(req, res, next) {
    var params = req.body;
    var pass = params.password;
    var authErrMsg = {
      message: 'Authentication failed. Wrong username or password.',
      code: 'wrongCredentials',
      status: 401
    };

    Group
      .findOne({ username: params.username })
      .exec((err, user) => {
        if (err) return next({ err: err, status: 401 });
        if (!user) return next(authErrMsg);

        // test a matching password
        user.comparePassword(pass, (err, isMatch) => {
          if (err || !isMatch) return next(authErrMsg);

          var userInfo = {
            _id: user._id,
            username: user.username,
            createdAt: user.createdAt,
            role: user.role,
            email: user.email,
            surname: user.surname,
            firstName: user.firstName
          };

          var token = jwt.sign(userInfo, config.secret, {
            expiresIn: '24h'
          });

          userInfo.token = token;

          // just to prove sockets are working, there are better use cases for using websockets
          req.io.emit('user:loggedIn');

          utils.sendJSONresponse(res, 200, userInfo);
        });
      });
  }

  /**
   * Create new user
   * POST '/users'
   */
  function createGroup(req, res, next) {
    var params = req.body;
    console.log('creating group', params)
    var group = new Group({
      groupName: params.groupName,
      groupManager: params.groupManager,
      members: params.members
      
    });
    console.log(group)
    // req params validation for required fields
    req.checkBody('groupName', 'groupname must be defined').notEmpty();
    req.checkBody('groupManager', 'groupmanager must be defined').notEmpty();

    // validate user input
    var errors = req.validationErrors();
    if (errors) {
        utils.sendJSONresponse(res, 400, errors);
        return;
    }

    group.save((err, newGroup) => {
      console.log('saving Group', newGroup)
      if (err) return next({ err: err, status: 400 });
      if (!newGroup) return next({ message: 'Group not created.', status: 400 });

      utils.sendJSONresponse(res, 201, newGroup);
    });
  }

  /**
   * Get all groups (paginated)
   * GET '/all groups/'
   */
  function getAllGroups(req, res, next) {
    console.log('getting groups')
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;

    var options = {
        offset: 0,
        page: page,
        limit: limit,
        lean: true
    };
    
    Group.paginate({}, options, (err, groups) => {
      console.log('Getting groups pagination')
      if (err) return next(err);
      if (!groups) return next({
        message: 'No groups found.',
        status: 404
      });

      var pagination = {
        pageNumber: groups.page,
        itemsPerPage: groups.limit,
        prev: res.locals.paginate.href(true),
        next: res.locals.paginate.href(),
      };

      utils.sendJSONresponse(res, 200, groups, false, pagination);
    });
  }

  /**
   * Get user
   * GET '/users/:userId'
   */
  function getGroup(req, res, next) {
    var params = req.params;
    console.log(params)
    Group
      .findOne({ '_id': ObjectId(params.groupId) })
      .exec((err, group) => {
        if (err) return next(err);
        if (!group) return next({
          message: 'group not found.',
          status: 404
        });

        utils.sendJSONresponse(res, 200, group);
      });
  }

  /**
   * Update user
   * PUT '/users/:userId'
   */
  function updateGroup(req, res, next) {
    var bodyParams = req.body;
    var currentGroup = req.group;
    console.log('currentGroup: ', currentGroup)
    console.log('body params: ', bodyParams.members)
    Group
      .findOneAndUpdate(
        { _id: ObjectId(bodyParams._id) },
        { '$set': {
          'groupName' : bodyParams.groupName,
          'groupManager': bodyParams.groupManager,
          'password': bodyParams.password,
          'groupImage': bodyParams.groupImage,
          'members': bodyParams.members,
          'wins' : bodyParams.wins,
          'updatedAt': bodyParams.updatedAt
          
          }
        },
        { upsert: false, new: true, runValidators: true, setDefaultsOnInsert: true })
      .exec((err, group) => {
        console.log('returnedgroup', group)
        if (err) return next({ err: err, status: 400 });
        if (!group) return next({
          message: 'group not found.',
          status: 404
        });

        utils.sendJSONresponse(res, 200, group);
      });
  }

  function getGroupsByUserId(req,res,next){
    // console.log(req.params);
    var params = req.params;
    Group.find({ 'members.userId': params.userId }, { 'members.$': 1 })
    .exec((err, data) => {
      if (err) return next(err);
      if (!data) return next({
        message: 'groups not found.',
        status: 404
      });
      var groupIds = []
      for (var i = 0; i < data.length; i++){
        // console.log(data[i]);
        groupIds.push(data[i]._id);
        
      }
      // console.log('IDS', groupIds);
      
      
    })
    .then((groupIds)=> {
      Group.find({'_id': { $in: groupIds }})
      .exec((err, data) => {
        if (err) return next(err);
        if (!data) return next({
          message: 'groups not found.',
          status: 404
        });
        utils.sendJSONresponse(res, 200, data);
      
      });
    })
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
  function verifyToken(req, res, next) {

    var token = req.headers['authorization'] || req.body.token;

    if (token) {

      jwt.verify(token, config.secret, (err, decodedToken) => {
        if (err)
          return next({
            status: 401,
            message: 'Failed to authenticate token.',
            name: 'unauthorized'
          });

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
