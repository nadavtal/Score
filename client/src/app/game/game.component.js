;(function() {

  'use strict';

  angular
    .module('boilerplate')
    .component('game', {
      bindings: {
        gameId: '<'
      },
      templateUrl: 'app/game/game.html',
      controllerAs: 'vm',
      controller: 'GameCtrl'
    });

  // GameCtrl.$inject = ['$log', '$state', '$stateParams', 'QueryService', 'localStorage', 'usersService', 'gamesService'
  //   'ngDialog', '$rootScope', '$scope'];

    angular
    .module('boilerplate').controller('GameCtrl' , function($log, $state, $stateParams, QueryService, localStorage, usersService, gamesService, groupsService,
      ngDialog, $rootScope, $scope, gameTypesService, platformService) {

    console.log('initializing GameCtrl', $scope)
    var vm = this;

    // methods
    vm.createGame = createGame;
    vm.editGame = editGame;
    vm.submitGameForm = submitGameForm;
    vm.registerToGame = registerToGame;
    vm.unRegisterToGame = unRegisterToGame;
    vm.addOptionalTime = addOptionalTime;
    vm.addToOptionalPLayers = addToOptionalPLayers;
    vm.removeFromOptionalPLayers = removeFromOptionalPLayers;
    vm.addPlayerToTimeOption = addPlayerToTimeOption;
    vm.selectGameType = selectGameType
    vm.selectPlatformType = selectPlatformType
    vm.removePlayerfromTimeOption = removePlayerfromTimeOption;
    vm.clearSearchTerm = clearSearchTerm;
    vm.searchTerm = '';
    vm.showBottomToolBar = false;
    var gameId = vm.gameId || $stateParams.gameId;
    var groupId = vm.groupId || $stateParams.groupId;
    vm.user = localStorage.get('user') || {};
    vm.registerd = false;
    vm.users = []
    
    if(!$rootScope.users){
      
      usersService.getAllUsers()
        .then((data) => {
          vm.users = data.data.data;
          if(!groupId){
            vm.optionalPlayers = vm.users;

          }
          
        })
      
    } else{
      vm.users = $rootScope.users;
      console.log('vm.users in game', vm.users);
    }

    if(groupId) {
      console.log('game component has groupId: ', groupId)
      groupsService.getGroup(groupId)
        .then((data) => {
          vm.optionalPlayers = data.data.data.members
          
        })
    }

    if (gameId) {
      console.log('game component has gameId: ', gameId)
      gamesService.getGame(gameId)
      .then(function(game) {
        
        vm.game = game.data.data;
        
        vm.game.time = new Date(vm.game.time);
        
        vm.timeOption = new Date(vm.game.time);
        vm.showBottomToolBar = true;
        console.log('game', vm.game);
        checkIfRegistered();
        checkIfInOptionalPlayer();
        
        console.log(vm.registerd)
        $log.debug('game', vm.game);
        
        // $scope.$apply();
        if(vm.game.group){

          groupsService.getGroup(vm.game.group)
            .then((data) => {
              vm.optionalPlayers = data.data.data.members
              console.log(vm.optionalPlayers);
              // $scope.$apply();
            })
        }
      })
      .catch(function(err) {
        $log.debug(err);
      });
    } else {
      vm.game = {};
      vm.game.players = [{userName: vm.user.userName, userId: vm.user._id}];
      vm.game.optionalPlayers = [];
      vm.game.host = vm.user.userName
      vm.game.time = new Date(Date.now());
      vm.group = groupId;
      vm.showBottomToolBar = true;
    console.log(vm.actionType);
    }

    var state = $state.current.name;
    // console.log(state)
   
    

    vm.actionType = setActionType(state, gameId);
    console.log('actionType: ', vm.actionType) 

    platformService.getAllPlatformsFromDataBase()
      .then((platforms) => {
        vm.platforms = platforms.data.data;
        // console.log('platforms:', vm.platforms)
        
        });

    gameTypesService.getAllGameTypes()
      .then((gameTypes) => {
        vm.gameTypes = gameTypes.data.data;
        // console.log('gameTypes:', vm.gameTypes)
        
        });

   
    function submitGameForm(game, gameId) {
      console.log(game, gameId);

      
      vm[vm.actionType](game, gameId);
    }

    
      

    function clearSearchTerm(){
      vm.searchTerm = ''
    }
      
      
    function selectGameType(typeName){
      // console.log(typeName);
      // console.log(vm.game)

      vm.game.gameType = typeName
      console.log(vm.game);
      // $scope.$apply()
    }  

    function selectPlatformType(typeName){
      // console.log(typeName);
      // console.log(vm.game)

      vm.game.platformType = typeName
      console.log(vm.game);
      // $scope.$apply()
    }    
      
    

    

    function setActionType(state, gameId) {
      if (state == 'editGame')
        vm.actionType = 'editGame';
      else if (state == 'createGame')
        vm.actionType = 'createGame';
      else if (state == 'createGroupGame')
        vm.actionType = 'createGame';
      else if (state == 'displayGame')
        vm.actionType = 'displayGame';
      else
        vm.actionType = 'loadGame';
      console.log(vm.actionType)
      return vm.actionType;
    }
    
    function createGame(game) {
      console.log(game)
      if (!game) return;
      if(groupId) game.group = groupId

      gamesService.createGame(game)
        .then(function(newGame) {
          console.log(newGame)
          var newGame = newGame.data.data;
          $log.debug('newGame', newGame);

          var dialog = ngDialog.open({
            template: '\
              <p>New game created</p>\
              <div class="ngdialog-buttons">\
                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'ok\')">OK</button>\
              </div>',
            plain: true
          });

          dialog.closePromise.then(function(closedDialog) {
            $state.go('displayGame', { gameId: newGame._id });
          });

        })
        .catch(function(err) {
          $log.debug(err);
        });
    }

    /**
     * Update game attributes
     * @param  {object} editGame Game form
     * @return {object}            Promise
     */
    
    vm.selectWinner = function(user){
      // console.log(user)
      vm.newWinner = {
        userName: user.userName, 
        userId: user.userId
      }
      console.log(vm.newWinner)
    }

    function editGame(game, gameId, responseMessage) {
      console.log('editing game', vm.newWinner, game.winner)
      if (!game) return;
      if(vm.newWinner && game.winner){
        if(vm.newWinner.userId != game.winner.userId){
          console.log('winner has been changed ', game.winner, 'vm.newWinner:' + vm.newWinner);
          $scope.$emit('selectNewWinner', game.winner, vm.newWinner);
          game.winner = vm.newWinner;
        }
      }
      
      if(vm.newWinner && !game.winner){
        console.log('winner has been declared ');
        $scope.$emit('selectWinner', vm.newWinner);
        game.winner = vm.newWinner;
      }
      console.log(game)
      QueryService
        .query('PUT', 'games/' + gameId, null, game)
        .then(function(updatedGame) {
          checkIfRegistered()


          var updatedGame = updatedGame.data.data;
          updatedGame.time = new Date(updatedGame.time)
          vm.game = updatedGame;
          console.log(vm.game);

          $log.debug('updatedGame', vm.updatedGame);

          ngDialog.open({
            template: '\
              <p>'+responseMessage+'</p>\
              <div class=\"ngdialog-buttons\">\
                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
              </div>',
            plain: true
          });

          

        })
        .catch(function(err) {
          $log.debug(err);
        });

         
    }

    /**
     * Get user
     * @param  {object} userId User ID
     * @return {object}      Promise
     */
    

    vm.addPlayer = function(user){
      console.log(user)
      vm.game.players.push({userName: user.userName, userId: user.userId})
    }

    vm.removePlayer = function(index){
      
      vm.game.players.splice(index, 1);
      console.log(vm.game.players)
    }

    function registerToGame() {
      
      if (!vm.game) return;
      console.log(vm.game)
      
      
      if(inOptionalPlayers){
        vm.game.optionalplayers = vm.game.optionalplayers.filter(function(value){
          console.log(value)
          return value.userName != vm.user.userName;
      
        });
        
      }

      if (registerd) {
        ngDialog.open({
          template: '\
            <p>You are allready registered to this game</p>\
            <div class=\"ngdialog-buttons\">\
                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
            </div>',
          plain: true
        });
      }
      else {
        vm.game.players.push({
          userName: vm.user.userName,
          userid: vm.user._id
        })
        console.log(vm.game);
        editGame(vm.game, vm.game._id, 'registered to '+ vm.game.name + ' at ' + vm.game.host);
      }
      
      
    }

    function unRegisterToGame() {
      
      if (!vm.game) return;
      vm.game.players = vm.game.players.filter(function(value){
        
        return value.userName != vm.user.userName;
    
      });
   
      editGame(vm.game, vm.game._id, 'Unregistered '+ vm.user.userName +' from '+ vm.game.gametype + ' at ' + vm.game.host)
      
    }



    function addOptionalTime(){
      // console.log(vm.timeOption);
      vm.game.timeoptions.push({
        date: vm.timeOption,
        players: [{
          userName: vm.user.userName,
          userid: vm.user._id
        }]
      })

      var responsMessage = 'added '+ vm.timeOption + ' to time options'
      addToOptionalPLayers(responsMessage)
    }

    function addPlayerToTimeOption(time){
      console.log(time);
      var inArray = checkIfUserInArrayByUsername(time.players, vm.user.userName)
      
      if (inArray) {
        ngDialog.open({
          template: '\
            <p>You are allready in this time option</p>\
            <div class=\"ngdialog-buttons\">\
                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
            </div>',
          plain: true
        });
      }
      else {
        time.players.push({
          userName: vm.user.userName,
          userid: vm.user._id
        })
        editGame(vm.game, vm.game._id, vm.user.userName + 'Added to optional time: '+ time.date +' for ' + vm.game.gametype + ' at '+ vm.game.host)
      }
      
    }

    function removePlayerfromTimeOption(time){
      console.log(time)
      time.players = time.players.filter(function(value){
        console.log(value)
        return value.userName != vm.user.userName;
    
      });
      
      editGame(vm.game, vm.game._id, vm.user.userName + ' removed from optional time: '+ time.date +' for ' + vm.game.gametype + ' at '+ vm.game.host)
    }

    function addToOptionalPLayers(responsMessage){
      var inArray = checkIfUserInArrayByUsername(vm.game.optionalplayers, vm.user.userName)

      if(inArray){
        ngDialog.open({
          template: '\
            <p>You are allready in tentative players</p>\
            <div class=\"ngdialog-buttons\">\
                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
            </div>',
          plain: true
        });
      }else{
        vm.game.optionalplayers.push({
          userName: vm.user.userName, 
          userid: vm.user._id
        });
        
        if(responsMessage) {
          editGame(vm.game, vm.game._id, responsMessage)
        } else{
          var responsMessage = 'added to tentative players';
          editGame(vm.game, vm.game._id, responsMessage)
        }
        
        // $scope.$apply()
      }

      checkIfInOptionalPlayer()
      
    }

    function removeFromOptionalPLayers(){
      var inArray = checkIfUserInArrayByUsername(vm.game.optionalplayers, vm.user.userName)
      
      if (inArray) {
        vm.game.optionalplayers = vm.game.optionalplayers.filter(function(value){
          console.log(value)
          return value.userName != vm.user.userName;
      
        });
        editGame(vm.game, vm.game._id, vm.user.userName +' removed from optional players for ' + vm.game.gametype + ' at '+ vm.game.host)
        checkIfInOptionalPlayer()
      }
      else {
        ngDialog.open({
          template: '\
            <p>You are not inoptional players</p>\
            <div class=\"ngdialog-buttons\">\
                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
            </div>',
          plain: true
        });
      }

      
    }

    function checkIfUserInArrayByUsername(array, userName){
       
      
      for (var i=0; i < array.length; i++) {
        
        if(array[i].userName == userName){
          var foundUser = array[i]
          console.log(foundUser)
        }
      }
      return foundUser
    }

    function checkIfUserInArrayById(array, id){
       
      
      for (var i=0; i < array.length; i++) {
        
        if(array[i]._id == id){
          var foundUser = array[i]
        }
      }
      return foundUser
    }

    function checkIfInOptionalPlayer(){
      
      var isOptional = checkIfUserInArrayByUsername(vm.game.optionalplayers, vm.user.userName)
      // console.log(isOptional)
      if (isOptional) vm.isOptional = true
      else vm.isOptional = false
      
    }

    function checkIfRegistered(){
      console.log(vm.game.players, vm.user.userName)
      var registerd = checkIfUserInArrayByUsername(vm.game.players, vm.user.userName)
      console.log(registerd)
      if (registerd) vm.registerd = true
      else vm.registerd = false
      
    }
    

  })

})();
