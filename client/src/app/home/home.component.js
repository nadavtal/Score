;(function() {

  'use strict';

  angular
    .module('boilerplate')
    .component('home', {
      templateUrl: 'app/home/home.html',
      controllerAs: 'vm',
      controller: HomeCtrl
    });


  HomeCtrl.$inject = ['$scope', 'QueryService', '$log', '$rootScope', 'localStorage', 'platformService', 'accountsService', '$timeout'];

  function HomeCtrl($scope, QueryService, $log, $rootScope, localStorage, platformService, accountsService, $timeout) {
    // console.log('rootscope', $rootScope);
    var vm = this
    vm.loaded = true;
    vm.user = localStorage.get('user');
    function createInitialUsers(){
      var users = [
        {userName: 'Nadi', firstName: 'Nadav', surname: 'Almagor', password: 'asd', email: 'nadavtalalmagor@gmail.com', role: 'admin'},
        {userName: 'Gads', firstName: 'Gadi', surname: 'Grosz', password: 'asd', email: 'gadi1@gmail.com', role: 'user'},
        {userName: 'Fatz', firstName: 'Tal', surname: 'Akta', password: 'asd', email: 'tal@gmail.com', role: 'user'},
        {userName: 'Yos', firstName: 'Yosi', surname: 'Gez', password: 'asd', email: 'yosi@gmail.com', role: 'admin'},
        {userName: 'Iris', firstName: 'Iris', surname: 'Tokatly', password: 'asd', email: 'iris@gmail.com', role: 'user'},
        {userName: 'Eli', firstName: 'Eli', surname: 'Yahu', password: 'asd', email: 'eli@gmail.com', role: 'user'},
        {userName: 'Nadi1', firstName: 'Nadav1', surname: 'Almagor1', password: 'asd', email: 'nadavtalalmagor1@gmail.com', role: 'user'},
        {userName: 'Gads1', firstName: 'Gadi1', surname: 'Grosz1', password: 'asd', email: 'gadi1@gmail.com', role: 'user'},
        {userName: 'Fatz1', firstName: 'Tal1', surname: 'Akta1', password: 'asd', email: 'tal1@gmail.com', role: 'user'},
        {userName: 'Yos1', firstName: 'Yosi1', surname: 'Gez1', password: 'asd', email: 'yosi1@gmail.com', role: 'user'},
        {userName: 'Iris1', firstName: 'Iris1', surname: 'Tokatly1', password: 'asd', email: 'iris1@gmail.com', role: 'user'},
        {userName: 'Eli1', firstName: 'Eli1', surname: 'Yahu1', password: 'asd', email: 'eli1@gmail.com', role: 'user'},

        {userName: 'Nadi2', firstName: 'Nadav2', surname: 'Almagor2', password: 'asd', email: 'nadavtalalmagor2@gmail.com', role: 'admin'},
        {userName: 'Gads2', firstName: 'Gadi2', surname: 'Grosz2', password: 'asd', email: 'gadi2@gmail.com', role: 'user'},
        {userName: 'Fatz2', firstName: 'Tal2', surname: 'Akta2', password: 'asd', email: 'tal2@gmail.com', role: 'user'},
        {userName: 'Yos2', firstName: 'Yosi2', surname: 'Gez2', password: 'asd', email: 'yosi2@gmail.com', role: 'admin'},
        {userName: 'Iris2', firstName: 'Iris2', surname: 'Tokatly2', password: 'asd', email: 'iris2@gmail.com', role: 'user'},
        {userName: 'Eli2', firstName: 'Eli2', surname: 'Yahu2', password: 'asd', email: 'eli2@gmail.com', role: 'user'},
        {userName: 'Nadi12', firstName: 'Nadav12', surname: 'Almagor12', password: 'asd', email: 'nadavtalalmagor12@gmail.com', role: 'user'},
        {userName: 'Gads12', firstName: 'Gadi12', surname: 'Grosz12', password: 'asd', email: 'gadi12@gmail.com', role: 'user'},
        {userName: 'Fatz12', firstName: 'Tal12', surname: 'Akta12', password: 'asd', email: 'tal12@gmail.com', role: 'user'},
        {userName: 'Yos12', firstName: 'Yosi12', surname: 'Gez12', password: 'asd', email: 'yosi12@gmail.com', role: 'user'},
        {userName: 'Iris12', firstName: 'Iris12', surname: 'Tokatly12', password: 'asd', email: 'iris12@gmail.com', role: 'user'},
        {userName: 'Eli12', firstName: 'Eli12', surname: 'Yahu12', password: 'asd', email: 'eli12@gmail.com', role: 'user'},

        {userName: 'Nadi3', firstName: 'Nadav3', surname: 'Almagor3', password: 'asd', email: 'nadavtalalmagor3@gmail.com', role: 'admin'},
        {userName: 'Gads3', firstName: 'Gadi3', surname: 'Grosz3', password: 'asd', email: 'gadi3@gmail.com', role: 'user'},
        {userName: 'Fatz3', firstName: 'Tal3', surname: 'Akta3', password: 'asd', email: 'tal3@gmail.com', role: 'user'},
        {userName: 'Yos3', firstName: 'Yosi3', surname: 'Gez3', password: 'asd', email: 'yosi3@gmail.com', role: 'admin'},
        {userName: 'Iris3', firstName: 'Iris3', surname: 'Tokatly3', password: 'asd', email: 'iris3@gmail.com', role: 'user'},
        {userName: 'Eli3', firstName: 'Eli3', surname: 'Yahu3', password: 'asd', email: 'eli3@gmail.com', role: 'user'},
        {userName: 'Nadi13', firstName: 'Nadav13', surname: 'Almagor13', password: 'asd', email: 'nadavtalalmagor13@gmail.com', role: 'user'},
        {userName: 'Gads13', firstName: 'Gadi13', surname: 'Grosz13', password: 'asd', email: 'gadi13@gmail.com', role: 'user'},
        {userName: 'Fatz13', firstName: 'Tal13', surname: 'Akta13', password: 'asd', email: 'tal13@gmail.com', role: 'user'},
        {userName: 'Yos13', firstName: 'Yosi13', surname: 'Gez13', password: 'asd', email: 'yosi13@gmail.com', role: 'user'},
        {userName: 'Iris13', firstName: 'Iris13', surname: 'Tokatly13', password: 'asd', email: 'iris13@gmail.com', role: 'user'},
        {userName: 'Eli13', firstName: 'Eli13', surname: 'Yahu13', password: 'asd', email: 'eli13@gmail.com', role: 'user'},
        
      ]

      var clashTags = ['#2JYGLLPU', '#Y8GRG9JY', "#GU8R2CCY"]

      for (let user  of users) {
        QueryService
        .query('POST', 'users/', null, user)
        .then(function(newUser) {
          var newUser = newUser.data.data;

          console.log('new user created: ', newUser)
          $log.debug('newUser', vm.newUser);

          

          // dialog.closePromise.then(function(closedDialog) {
          //   $state.go('displayUser', { userId: vm.newUser._id });
          // });

        })
        .catch(function(err) {
          $log.debug(err);
        });
      } 
    }
  // createInitialUsers()
    

    



    
    
    

    
  

    

    
      
  }
      



  

})();
