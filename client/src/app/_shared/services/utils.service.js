;(function() {

  'use strict';

  /**
   * Generic utility functions goes here
   */

  angular
    .module('boilerplate')
    .service('utils', UtilsService);

  UtilsService.$inject = ['QueryService'];

  function UtilsService(QueryService) {
    
    this.findUserInArrayById = findUserInArrayById;
    this.findUserInArrayByUserName = findUserInArrayByUserName;
    this.removeUserFronArrayByUserName = removeUserFronArrayByUserName;
    this.getItems = getItems
     

    function findUserInArrayById(array, user){
      // console.log(array, user)
      return array.find(function(element) {
        // console.log(element)
         return element.userId == user._id;
      });
    }

    function findUserInArrayByUserName(array, userName){
       
      
      for (var i=0; i < array.length; i++) {
        
        if(array[i].userName == userName){
          var foundUser = array[i]
          // console.log(foundUser)
        }
      }
      return foundUser
    }

    function removeUserFronArrayByUserName(array, userName){
      array = array.filter(function(value){
        // console.log(value)
        return value.userName != userName;
    
      });
      return array;
    }
    
    function getItems(collection, paramName, value, operator){
      console.log(value)
      var today = new Date(value).setHours(0, 0, 0, 0);
      console.log(today)
      var url = collection + '/' + paramName + '/' + today + '/' + operator;
      console.log(url)  
      return QueryService.query('GET', url, null, null);
    }
  }

})();
