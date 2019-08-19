;(function() {

  'use strict';

  angular
    .module('boilerplate')
    .component('account', {
      bindings: {
        _id: '<'
      },
      templateUrl: 'app/account/account.html',
      controllerAs: 'vm',
      controller: UserCtrl
    });

  UserCtrl.$inject = ['$log', '$state', '$stateParams', 'QueryService', 'localStorage', 'platformService', 'accountsService', 
    'ngDialog', '$rootScope', '$scope', 'gamesService','usersService', 'groupsService','friendsService'];

  function UserCtrl($log, $state, $stateParams, QueryService, localStorage, platformService, accountsService, 
      ngDialog, $rootScope, $scope, gamesService, usersService, groupsService, friendsService) {
    var vm = this;
    
    
    
    // methods
    
    vm.$onInit = function() {
      
      var accountId = $stateParams._id;
      console.log(accountId);
      accountsService.getAccount(accountId)
        .then((account) => {
          vm.account = account.data.data;
          console.log(vm.account)
        })
        
          

       
    };

    

   
    

  }

})();
