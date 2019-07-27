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
    return{
      replaceOldItemWithUpdated: function (array, updatedItem){
        console.log('replaceOldItemWithUpdatedService', array);
        // for(i = 0; i<array.length; i++){
        //   console.log(array[i])
        //   if(array[i]._id == updatedItem._id){
        //     console.log('foundItem', array[i], updatedItem)
        //     array[i] = updatedItem
        //   }
        // }
        console.log('finishes');
       }
    };
     
  }

})();
