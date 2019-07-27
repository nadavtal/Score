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
      ngDialog, $rootScope, $scope) {

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
    vm.removeFromOptionalPLayers = removeFromOptionalPLayers
    vm.addPlayerToTimeOption = addPlayerToTimeOption;
    vm.removePlayerfromTimeOption = removePlayerfromTimeOption

    console.log($stateParams)    
    var gameId = vm.gameId || $stateParams.gameId;
    var groupId = vm.groupId || $stateParams.groupId;
    console.log($stateParams)
    console.log(groupId);

    
    if(!$rootScope.users){
      console.log('no rootscope users');
      usersService.getAllUsers()
        .then((data) => {
          vm.users = data.data.data;
          vm.optionalPlayers = vm.users;
          console.log(vm.users)
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
          console.log(vm.optionalPlayers);
          // $scope.$apply();
        })
    }

    if (gameId) {
      console.log('game component has gameId: ', gameId)
      gamesService.getGame(gameId)
      .then(function(game) {
        
        vm.game = game.data.data;
        vm.game.time = new Date(vm.game.time);
        vm.timeOption = new Date(vm.game.time);
        checkIfRegistered();
        checkIfInOptionalPlayer();

        console.log('game', vm.game);
        
        $log.debug('game', vm.game);

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
      vm.game.players = [];
      vm.host = ''
      vm.time = Date.now
      vm.group = groupId
    console.log(vm.actionType);
    }

    var state = $state.current.name;
    console.log(state)
    vm.user = localStorage.get('user') || {};
    vm.registerd = false;
    vm.users = []
    

    vm.actionType = setActionType(state, gameId);
    console.log('actioType: ', vm.actionType) 

   
    function submitGameForm(game, gameId) {
      console.log(game, gameId)
      vm[vm.actionType](game, gameId);
    }

    
      


      
      
        
      
    

    

    function setActionType(state, gameId) {
      if (state == 'editGame')
        vm.actionType = 'editGame';
      else if (state == 'createGame')
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
      console.log(user)
      vm.newWinner = {
        username: user.username, 
        userid: user.userid
      }
      console.log(vm.newWinner)
    }

    function editGame(game, gameId, responseMessage) {
      
      if (!game) return;
      if(vm.newWinner && game.winner){
        if(vm.newWinner.userid != game.winner.userid){
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
     
      QueryService
        .query('PUT', 'games/' + gameId, null, game)
        .then(function(updatedGame) {
          checkIfRegistered()


          vm.updatedGame = updatedGame.data.data;
          console.log(vm.updatedGame)
          $log.debug('updatedGame', vm.updatedGame);

          ngDialog.open({
            template: '\
              <p>'+responseMessage+'</p>\
              <div class=\"ngdialog-buttons\">\
                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
              </div>',
            plain: true
          });

          return 'updaed'

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
      vm.game.players.push({username: user.userName, userid: user.userId})
    }

    vm.removePlayer = function(index){
      
      vm.game.players.splice(index, 1);
      console.log(vm.game.players)
    }

    function registerToGame() {
      
      if (!vm.game) return;

      var registerd = checkIfUserInArrayByUsername(vm.game.players, vm.user.username);
      var inOptionalPlayers = checkIfUserInArrayByUsername(vm.game.optionalplayers, vm.user.username)
      
      if(inOptionalPlayers){
        vm.game.optionalplayers = vm.game.optionalplayers.filter(function(value){
          console.log(value)
          return value.username != vm.user.username;
      
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
          username: vm.user.username,
          userid: vm.user._id
        })
        console.log(vm.game);
        editGame(vm.game, vm.game._id, 'registered to '+ vm.game.gametype + ' at ' + vm.game.host);
      }
      
      
    }

    function unRegisterToGame() {
      
      if (!vm.game) return;
      vm.game.players = vm.game.players.filter(function(value){
        
        return value.username != vm.user.username;
    
      });
   
      editGame(vm.game, vm.game._id, 'Unregistered '+ vm.user.username +' from '+ vm.game.gametype + ' at ' + vm.game.host)
      
    }



    function addOptionalTime(){
      // console.log(vm.timeOption);
      vm.game.timeoptions.push({
        date: vm.timeOption,
        players: [{
          username: vm.user.username,
          userid: vm.user._id
        }]
      })

      var responsMessage = 'added '+ vm.timeOption + ' to time options'
      addToOptionalPLayers(responsMessage)
    }

    function addPlayerToTimeOption(time){
      console.log(time);
      var inArray = checkIfUserInArrayByUsername(time.players, vm.user.username)
      
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
          username: vm.user.username,
          userid: vm.user._id
        })
        editGame(vm.game, vm.game._id, vm.user.username + 'Added to optional time: '+ time.date +' for ' + vm.game.gametype + ' at '+ vm.game.host)
      }
      
    }

    function removePlayerfromTimeOption(time){
      console.log(time)
      time.players = time.players.filter(function(value){
        console.log(value)
        return value.username != vm.user.username;
    
      });
      
      editGame(vm.game, vm.game._id, vm.user.username + ' removed from optional time: '+ time.date +' for ' + vm.game.gametype + ' at '+ vm.game.host)
    }

    function addToOptionalPLayers(responsMessage){
      var inArray = checkIfUserInArrayByUsername(vm.game.optionalplayers, vm.user.username)

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
          username: vm.user.username, 
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
      var inArray = checkIfUserInArrayByUsername(vm.game.optionalplayers, vm.user.username)
      
      if (inArray) {
        vm.game.optionalplayers = vm.game.optionalplayers.filter(function(value){
          console.log(value)
          return value.username != vm.user.username;
      
        });
        editGame(vm.game, vm.game._id, vm.user.username +' removed from optional players for ' + vm.game.gametype + ' at '+ vm.game.host)
        checkIfInOptionalPlayer()
      }
      else {
        ngDialog.open({
          template: '\
            <p>You are allready in tentative players</p>\
            <div class=\"ngdialog-buttons\">\
                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
            </div>',
          plain: true
        });
      }

      
    }

    function checkIfUserInArrayByUsername(array, username){
       
      
      for (var i=0; i < array.length; i++) {
        
        if(array[i].username == username){
          var foundUser = array[i]
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
      
      var isOptional = checkIfUserInArrayByUsername(vm.game.optionalplayers, vm.user.username)
      console.log(isOptional)
      if (isOptional) vm.isOptional = true
      else vm.isOptional = false
      
    }

    function checkIfRegistered(){
      
      var registerd = checkIfUserInArrayByUsername(vm.game.players, vm.user.username)
      console.log(registerd)
      if (registerd) vm.registerd = true
      else vm.registerd = false
      
    }
    

  })

})();
