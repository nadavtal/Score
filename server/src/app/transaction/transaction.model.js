;(function() {

  'use strict';

  /**
   * Define Game model
   */
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;
  
  var mongoosePaginate = require('mongoose-paginate');
  

  /**
   * Game schema definition
   */
  var transactionSchema = new Schema({
    
    transactionType: {
      type: String,
      enum: {
        values: ['Deposit', 'Withdraw', 'Transfer', 'Bonus','Tournament Registration', 'Tournament UnRegistration', 'Game Registration', 'Game UnRegistration', 'Tournament Win', 'Game Win'],
        message: "Only 'Deposit', 'Withdraw', 'bonus', 'Tournament Registration', 'Tournament UnRegistration', 'Game Registration', 'Game UnRegistration', 'Tournament Win', 'Game Win' or 'Transfer' types are allowed."
      },
      required: true
    },
    transactionMethod: {
      type: String,
      enum: {
        values: ['Credit card', 'Wire', 'Agent'],
        message: "Only 'Deposit', 'Withdraw' or 'Transfer' types are allowed."
      },
      
    },
    userId: {
      type: ObjectId,
      required: true
    },
    gameId: ObjectId,
    tournamentId: ObjectId,
    agent: {
      agentId: ObjectId,
      agentName: String
    },
    
    amount: {
      type: Number,
      required: true
    },
    createdAt: Date,
      
    
    

   
  });

  /**
   * On every save...
   */
  transactionSchema.pre('save', function(next) {
    var transaction = this;
    next();
    
  });

  


  /**
   * Schema plugins
   */
  transactionSchema.plugin(mongoosePaginate);

  /**
   * Schema methods
   */


  // create model
  var Transaction = mongoose.model('Transaction', transactionSchema);

  // public
  module.exports = Transaction;


})();
