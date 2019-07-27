;(function() {

  'use strict';

  /**
   * $http service abstraction to make API calls with any HTTP method,
   * custom url, and params.
   *
   * @category  service
   * @author    Jozef Butko
   * @example   Inject QueryService as the dependency and then use it this way:
   *
   * 
   *
   */

  angular
    .module('boilerplate')
    .service('clashUserService', clashUserService);

    clashUserService.$inject = ['$http', 'CONSTANTS', 'QueryService'];

  function clashUserService($http, CONSTANTS, QueryService) {
    
    this.getClashUser = getClashUser


    function getClashUser(usertag) {
      console.log('getting clash user', usertag)
      if (!usertag) return;
      
      console.log(usertag)
      
      
      
        var reparedUserId = '%23'+ usertag.slice(1, usertag.length)
        console.log(usertag, reparedUserId);
      return QueryService.query('GET', 'clashusers/'+reparedUserId, null, null)

    /// definitions
    }
  }

})();
