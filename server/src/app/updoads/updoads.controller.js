;(function() {

  'use strict';

  /**
   * Users endpoint controller
   * @desc Handler functions for all /users routes
   */
    
  var utils = require('../utils/utils.js');
  var Upload = require('./updoads.model')
  // public
  module.exports = {
    uploadImage, 
    getUploads, 
    getUploadsByUserId
  };

  function uploadImage(req,res,next){
    
    console.log('uploading file', req.body);
    var upload = new Upload({
      file: req.file,
      userId: req.body.userId
    })

    req.checkBody('file', 'there is no file').notEmpty();
    upload.save((err, newUpload) => {
      console.log('saving upload', newUpload)
      if (err) return next({ err: err, status: 400 });
      if (!newUpload) return next({ message: 'Upload not created.', status: 400 });

      utils.sendJSONresponse(res, 201, newUpload);
    });
    // res.json(req.file);
  }

  function getUploads(req,res,next){
    console.log('getting uploads');
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;

    var options = {
        offset: 0,
        page: page,
        limit: limit,
        lean: true
    };
    

    Upload.paginate({}, options, (err, files) => {
      console.log('paginating')
      if (err) return next(err);
      if (!files) return next({
        message: 'No uploads found.',
        status: 404
      });

      var pagination = {
        pageNumber: files.page,
        itemsPerPage: files.limit,
        prev: res.locals.paginate.href(true),
        next: res.locals.paginate.href(),
      };

      utils.sendJSONresponse(res, 200, files, false, pagination);
    });
    // res.json();
  }

  function getUploadsByUserId(req,res,next){
    var params = req.params;
    console.log('getting files by userId: ', params.userId)

    Upload.find({ 'userId': params.userId })
    .exec((err, files) => {
      if (err) return next(err);
      if (!files) return next({
        message: 'files not found.',
        status: 404
      });
      utils.sendJSONresponse(res, 200, files);
    });
    
      
  }


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
