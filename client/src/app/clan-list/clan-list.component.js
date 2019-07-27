;(function() {
 
  'use strict';

  /**
   * Show user list table
   *
   * @usage <user-list users="vm.games"></user-list>
   */

  angular
    .module('boilerplate')
    .component('clanList', {
      bindings: {
        clans: '<'
      },
      templateUrl: 'app/clan-list/clan-list.html',
      controllerAs: 'vm',
      controller: clanListCtrl
    });

    clanListCtrl.$inject = ['$log', 'QueryService', '$rootScope', 'localStorage', '$stateParams', 'clanService'];

  function clanListCtrl($log, QueryService, $rootScope, localStorage, $stateParams, clanService) {
    var vm = this;
    vm.user = localStorage.get('user');
    vm.creatClan = createClan
    
    
    vm.$onInit = function() {
      clanService.getClansFromDatabase()
      .then(function(data){
        console.log(data)
        vm.clans = data.data.data
      })
    };

    function createClan() {
      console.log(vm.newClanTag)
      if (!vm.newClanTag) return;

      QueryService
        .query('POST', 'clashclans/', null, {clanTag: vm.newClanTag})
        .then(function(newClan) {
          vm.newClan = newClan.data.data;
          $log.debug('newClan', vm.newClan);

          var dialog = ngDialog.open({
            template: '\
              <p>New clan created</p>\
              <div class="ngdialog-buttons">\
                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'ok\')">OK</button>\
              </div>',
            plain: true
          });

          // dialog.closePromise.then(function(closedDialog) {
          //   $state.go('displayUser', { userId: vm.newClan._id });
          // });

        })
        .catch(function(err) {
          $log.debug(err);
        });
    }


    function getClansFromDatabase(){
      QueryService.query('Get', 'clashclans/', null, null).then(function(data){
        console.log(data)
        vm.clans = data.data.data
      })
    }

    
  }

})();
