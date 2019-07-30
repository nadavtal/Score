;(function() {

  'use strict';

  /**
   * Service for localStorage functionality
   *
   * @category  service
   * @author    Nadav tal Almagor
   * @example   Inject LocalStorage as the dependency and then use it like this:
  
   */
  angular
    .module('boilerplate')
    .service('usersService', usersService);

  usersService.$inject = ['$window', '$rootScope', '$log', 'QueryService'];

  function usersService($window, $rootScope, $log, QueryService) {
    this.getAllUsers = getAllUsers;
    this.getUser = getUser;
    this.editUser = editUser;

    /// definitions

    
    function getAllUsers() {
      console.log('getting users')
       
      return QueryService
        .query('GET', 'users/', null, null)
        
    }

    function getUser(userId) {
      if (!userId) return;

      return QueryService
        .query('GET', 'users/' + userId, null, null)
        
    }
    
    function editUser(user, userId) {
      if (!user) return;
      console.log('user before update', user);
      return QueryService
        .query('PUT', 'users/' + userId, null, user)
    }



  }


})();
