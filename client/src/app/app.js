;(function() {

  /**
   * Definition of the main app module and its dependencies
   */
  angular
    .module('boilerplate', [
      'ui.router',
      'ngDialog',
      'ngMaterial',
      'btford.socket-io',
      'angularUtils.directives.dirPagination',
      'ngAnimate',
      'ngMaterialDatePicker',
    ])
    .config(config);

  config.$inject = ['$locationProvider', '$httpProvider', '$logProvider'];

  /**
   * App config
   */
  function config($locationProvider, $httpProvider, $logProvider) {
    // console.log($mdIconProvider)
    // $locationProvider.html5Mode(true);
    // $mdIconProvider
    // .iconSet('communication', 'img/icons/sets/communication-icons.svg')
    // .icon('favorite', 'img/icons/favorite.svg');
    $httpProvider.interceptors.push('authInterceptor');

    // you can turn off logging globaly here (for production)
    // $logProvider.debugEnabled(false);
    $logProvider.debugEnabled(true);

  }

  /**
   * Run block
   */
  angular
    .module('boilerplate')
    .run(run);

  run.$inject = ['$transitions', '$location', '$state', '$rootScope', 'localStorage'];

  function run($transitions, $location, $state, $rootScope, localStorage) {
    // this runs on every route change
    $transitions.onStart({}, function(trans) {
      trans.promise.then(function(state) {

        // route authorization can be handled here (admin routes etc.)
        // you should have `role` attribute in routes you want to restrict in `app.routes.js`
        // var user = localStorage.get('user');
        // var isAuthorized = state.role && state.role.indexOf(user.role) > -1;
        // if (state.role && !isAuthorized)
        //   return $state.go('home');
      });
    });

    $rootScope.$on('user:logout', function() {
      
      logoutUser();
    });

    function logoutUser() {
      console.log('logginout')
      $state.go('home');
      localStorage.remove('user');
    }

  }

  
  
    angular
      .module('boilerplate').controller('mainController' , function(QueryService, $log, $rootScope, clanService, localStorage, platformService){
        console.log('mainController');
        var vm = this

        

        // getUsers();

        // platformService.getAllPlatformsFromDataBase()
        //   .then((platforms) => {
        //     console.log(platforms.data.data)
        //     $rootScope.platforms = platforms.data.data;
        //     localStorage.set('platforms', platforms.data.data);
        //     // console.log($rootScope.platforms)
        //   })

        

        // clanService.getAllBattlesFromDataBase()
        //   .then((friendlyBattles) =>{
        //     console.log(friendlyBattles)
        //   })
        // updateNewFriendlyBattlesFromAllClans();  
    // $interval(updateNewFriendlyBattlesFromAllClans, 1800000);


        function updateNewFriendlyBattlesFromAllClans(){
          clanService.getClansFromDatabase()
          .then(function(data){
            // console.log(data)
            vm.clans = data.data.data;
            
            for(var i = 0; i<vm.clans.length; i++){
              // console.log(vm.clans[i].Name)
              clanService.getFriendlyBattlesByClan(vm.clans[i].Name)
              .then((friendlyBattles) => {
                // console.log(friendlyBattles)
                for(var i = 0; i<friendlyBattles.length; i++){
                  clanService.checkIfBattleExists(friendlyBattles[i])
                    .then((battle)=>{
                      // console.log(battle)
                      if(battle){
                        
                        clanService.addBattleToDB(battle)
                        .then((data) => {
                          console.log('added to DB')
                        })
                      } else{
                        console.log('battle exists in DB')
                      }
                    })
                  
                }
              })
            }
          })
        } 
        
        function createInitialUsers(){
          var users = [
            {userName: 'Nadi', firstName: 'Nadav', surname: 'Almagor', password: 'asd', email: 'nadavtalalmagor@gmail.com', role: 'admin'},
            {userName: 'Gads', firstName: 'Gadi', surname: 'Grosz', password: 'asd', email: 'gadi@gmail.com', role: 'user'},
            {userName: 'Fatz', firstName: 'Tal', surname: 'Akta', password: 'asd', email: 'tal@gmail.com', role: 'user'},
            {userName: 'Yos', firstName: 'Yosi', surname: 'Gez', password: 'asd', email: 'yosi@gmail.com', role: 'admin'},
            {userName: 'Iris', firstName: 'Iris', surname: 'Tokatly', password: 'asd', email: 'iris@gmail.com', role: 'user'},
            {userName: 'Eli', firstName: 'Eli', surname: 'Yahu', password: 'asd', email: 'eli@gmail.com', role: 'user'},
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



        
      

      })

})();
