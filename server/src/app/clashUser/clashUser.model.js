;(function() {

  'use strict';

  /**
   * Define user model
   */
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var mongoosePaginate = require('mongoose-paginate');
  
  var Battle = require('../battle/battle.model')
  // var Game = require('../game/game.model')
  /**
   * User schema definition
   */
  var clashUserSchema = new Schema({
    userTag: {
      type: String,
      required: true,
      unique: true
    },
    battles: [Battle.schema]
  });

  /**
   * On every save...
   */
  clashUserSchema.pre('save', function(next) {
    var user = this;

    next()
  });

  // userSchema.pre('findOneAndUpdate', function(next) {
  //   var user = this;

  //   // update updateAt value
  //   var currentDate = new Date();
  //   user.update({}, { $set: { updatedAt: currentDate } });
  //   next();
  // });


  /**
   * Schema plugins
   */
  clashUserSchema.plugin(mongoosePaginate);

  

  // create model
  var ClashUser = mongoose.model('ClashUser', clashUserSchema);

  // public
  module.exports = ClashUser;


})();
