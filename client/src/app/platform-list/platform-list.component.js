;(function() {

  'use strict';

  /**
   * Show user list table
   *
   * @usage <user-list users="vm.users"></user-list>
   */

  angular
    .module('boilerplate')
    .component('platformList', {
      
      templateUrl: 'app/platform-list/platform-list.html',
      controllerAs: 'vm',
      controller: platformListCtrl
    });

  platformListCtrl.$inject = ['$log', 'QueryService', '$rootScope',];

  function platformListCtrl($log, QueryService, $rootScope) {
    var vm = this;

    vm.$onInit = function() {
      
      // getPlatforms();
    };

    /// definitions
    

    /**
     * Get users
     */

    function createPlatform(platform) {
      if (!platform) return;

      QueryService
        .query('POST', 'platforms/', null, platform)
        .then(function(newPlatform) {
          vm.newPlatform = newPlatform.data.data;
          $log.debug('newPlatform', vm.newPlatform);

          var dialog = ngDialog.open({
            template: '\
              <p>New platform created</p>\
              <div class="ngdialog-buttons">\
                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'ok\')">OK</button>\
              </div>',
            plain: true
          });

          // dialog.closePromise.then(function(closedDialog) {
          //   $state.go('displayPlatform', { platformId: vm.newPlatform._id });
          // });

        })
        .catch(function(err) {
          $log.debug(err);
        });
    }


    function getPlatforms() {
      QueryService
        .query('GET', 'platforms/', null, null)
        .then(function(data) {
          
          vm.platforms = data.data.data;
          
          $rootScope.platforms = vm.platforms;
          
          $log.debug('platforms', vm.platforms);
        })
        .catch(function(err) {
          $log.debug(err);
        });
    }
  }

})();
