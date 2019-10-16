;(function() {

  'use strict';

  /**
   * Define user model
   */
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var mongoosePaginate = require('mongoose-paginate');
  
  var Battle = require('../battle/battle.model');
  
  /**
   * User schema definition
   */
  var clanSchema = new Schema({
    Name: {
      type: String,
      required: true,
      unique: true
    },
    battles: Array,
    active: {
      type: Boolean,
      default: true
    },
    inActiveReason: String,
    lastActiveDate: Date
  });

  /**
   * On every save...
   */
  clanSchema.pre('save', function(next) {
    var user = this;

    next()
    });
  

  clanSchema.pre('findOneAndUpdate', function(next) {
    var clan = this;

    // update updateAt value
    var currentDate = new Date();
    clan.update({}, { $set: { updatedAt: currentDate } });
    next();
  });


  /**
   * Schema plugins
   */
  clanSchema.plugin(mongoosePaginate);

 
  // create model
  var Clan = mongoose.model('Clan', clanSchema);

  // public
  module.exports = Clan;


})();
