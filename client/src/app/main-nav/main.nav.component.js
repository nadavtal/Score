;(function() {

  'use strict';

  /**
   * Main navigation
   *
   * @example
   * <main-nav><main-nav/>
   *
   */
  angular
    .module('boilerplate')
    .component('mainNav', {
      templateUrl: 'app/main-nav/main-nav.html',
      controllerAs: 'mnCtrl',
      controller: MainNavCtrl
    });

    MainNavCtrl.$inject = ['$scope', '$rootScope', 'localStorage'];

    /// definition

    function MainNavCtrl($scope, $rootScope, localStorage) {
      var vm = this;
      vm.user = localStorage.get('user');
      console.log(vm.user);
      vm.currentNavItem = 'home';
      
      vm.goto = function(page) {
        console.log("Goto " + page);
      }
      /// definitions

      /**
       * Events
       */
      $scope.$on('user:login', function() {
        vm.user = localStorage.get('user');
        $rootScope.user = vm.user
        
      });

      $scope.$on('user:logout', function() {
        vm.user = null;
        $rootScope.user = null
       
      });
    }

})();
