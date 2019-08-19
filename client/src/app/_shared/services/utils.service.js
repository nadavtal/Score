;(function() {

  'use strict';

  /**
   * Generic utility functions goes here
   */

  angular
    .module('boilerplate')
    .service('utils', UtilsService);

  UtilsService.$inject = [];

  function UtilsService() {
    
    this.findUserInArrayById = findUserInArrayById
     

    function findUserInArrayById(array, user){
      // console.log(array, user)
      return array.find(function(element) {
        // console.log(element)
         return element.userId == user._id;
      });
    }
  }

})();
