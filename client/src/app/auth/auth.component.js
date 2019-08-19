;(function() {

  'use strict';

  angular
    .module('boilerplate')
    .component('auth', {
      templateUrl: 'app/auth/auth.html',
      controllerAs: 'vm',
      controller: AuthCtrl
    });

  AuthCtrl.$inject = ['$rootScope', '$scope', '$log', 'QueryService', 'ngDialog',
    'localStorage', '$state', 'socket', '$location'];

  function AuthCtrl($rootScope, $scope, $log, QueryService, ngDialog,
    localStorage, $state, socket, $location) {
      var vm = this;
      vm.login = login;
      vm.logout = logout;
      vm.user = localStorage.get('user');

      vm.$onInit = function() {
        // just an socket.io message example
        socket.on('user:loggedIn', function(newUser) {
          $log.debug('incominng websocket message from ExpressJS server: some user just authenticated!');
        });
      };

      /// definitions

      function login() {
        var params = {
          userName: vm.userName,
          password: vm.password
        };

        QueryService
          .query('POST', 'users/authenticate', null, params)
          .then(function(resp) {
            // console.log(resp)
            vm.user = resp.data.data;
            $rootScope.user = vm.user;
            console.log(vm.user);

            localStorage.set('user', vm.user);
            console.log(window.localStorage)
            $rootScope.$broadcast('user:login', vm.user);
            // $location.path('/users/'+vm.user._id);
            $location.path('/users/'+ vm.user._id);
            // $scope.$apply();
          })
          .catch(function(error) {
            var errCode = error.data && error.data.error && error.data.error.code;

            if (errCode == 'wrongCredentials')
              ngDialog.open({
                template: '\
                  <p>Authentication failed. Wrong username or password. Try again please.</p>\
                  <div class="ngdialog-buttons">\
                      <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'logout\')">OK</button>\
                  </div>',
                plain: true
              });
          });
      }

      function logout() {
        Swal.fire({
          title: 'Are you sure you want to log out?',
          text: "",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes please'
        }).then((result) => {
          if (result.value) {
            $rootScope.$broadcast('user:logout');
            $rootScope.user = null;
            Swal.fire(
          
              'loggedout!',
              'Have a great day, see you soon',
              'success'
            )
          }
        })
        // var dialog = ngDialog.open({
        //   template: '\
        //     <p>Do you really want to log out?</p>\
        //     <div class="ngdialog-buttons">\
        //         <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">No</button>\
        //         <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'logout\')">Yes</button>\
        //     </div>',
        //   plain: true
        // });

        // // log out user after confirmation
        // dialog.closePromise.then(function(closedDialog) {
        //   if (closedDialog.value == 'logout')
        //     $rootScope.$broadcast('user:logout');
        //     $rootScope.user = null;
        // });
      }

      $scope.$on('user:logout', function() {
        vm.user = null;
      });

  }

})();
