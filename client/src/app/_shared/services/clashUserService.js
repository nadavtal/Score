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
    
    this.getClashUser = getClashUser;
    this.getClashUserBattles = getClashUserBattles;
    this.getClashUserFromDb = getClashUserFromDb;
    this.getAllClashUsers = getAllClashUsers;

    //get clash user from clash API
    function getClashUser(usertag) {
      if (!usertag) return;
      var reparedUserId = '%23'+ usertag.slice(1, usertag.length)
      return QueryService.query('GET', 'clashusers/'+reparedUserId, null, null)

    /// definitions
    }

    function getClashUserFromDb(usertag) {
      if (!usertag) return;
      console.log(usertag);
      var reparedUserId = '%23'+ usertag.slice(1, usertag.length)
      return QueryService.query('GET', 'clashusers/'+reparedUserId+'/battles', null, null)

    /// definitions
    }
    function getClashUserBattles(userTag) {
      // console.log('alksdlaksjdlakjsdd')
      var reparedUserId = '%23'+ userTag.slice(1, userTag.length)
      if (!reparedUserId) return;
      return QueryService
        .query('GET', 'clashusers/'+reparedUserId+'/battles', null, null)

    /// definitions
    }

    function getAllClashUsers(){
      return QueryService
        .query('GET', 'clashusers/', null, null)
    }
  }

})();
