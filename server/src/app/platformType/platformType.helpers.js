;(function() {

  'use strict';

  /**
   * Game model helpers
   */

  var bcrypt = require('./node_modules/bcryptjs');
  var SALT_WORK_FACTOR = 10;

  // public
  module.exports = {
    
  };

  /// definitions

 

  /**
   * Set timestamps - createdAt, updatedAt
   */
  function setTimestamps(game, next) {
    // get the current date
    var currentDate = new Date();

    // change the updatedAt field to current date
    if (game.createdAt)
      game.updatedAt = currentDate;

    // if createdAt doesn't exist, add this field
    if (!game.createdAt)
      game.createdAt = currentDate;

    next();
  }

  /**
   * Compare hashed password with pass sent in body params
   */
  function comparePassword(passToTest, cb) {
    bcrypt.compare(passToTest, this.password, (err, isMatch) => {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };

})();
