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
      controller: GameCtrl
    });

  GameCtrl.$inject = ['$log', '$state', '$stateParams', 'QueryService', 'localStorage', 'usersService', 'gamesService', 'groupsService', 
    'ngDialog', '$rootScope', '$scope', 'gameTypesService', 'platformService', 'messagesService'];

    // angular
    // .module('boilerplate').controller('GameCtrl' , function($log, $state, $stateParams, QueryService, localStorage, usersService, gamesService, groupsService,
    //   ngDialog, $rootScope, $scope, gameTypesService, platformService) {
    function GameCtrl($log, $state, $stateParams, QueryService, localStorage, usersService, gamesService, groupsService,
      ngDialog, $rootScope, $scope, gameTypesService, platformService, messagesService){

    console.log('initializing GameCtrl', $scope)
    var vm = this;

    // methods
    vm.createGame = createGame;
    vm.editGame = editGame;
    vm.submitGameForm = submitGameForm;
    vm.registerToGame = registerToGame;
    vm.addPlayer = addPlayer;
    vm.removePlayer = removePlayer;
    vm.invitePlayer = invitePlayer;
    vm.unRegisterToGame = unRegisterToGame;
    vm.addOptionalTime = addOptionalTime;
    vm.addToOptionalPLayers = addToOptionalPLayers;
    vm.removeFromOptionalPLayers = removeFromOptionalPLayers;
    vm.addPlayerToTimeOption = addPlayerToTimeOption;
    vm.selectGameType = selectGameType
    vm.selectPlatformType = selectPlatformType
    vm.removePlayerfromTimeOption = removePlayerfromTimeOption;
    vm.sendInvitationsToPlayers = sendInvitationsToPlayers;
    vm.addGroupsToGame = addGroupsToGame;
    vm.takeThisPlace = takeThisPlace
    vm.removeFromThisPlace = removeFromThisPlace

    vm.clearSearchTerm = clearSearchTerm;
    vm.searchTerm = '';
    vm.showBottomToolBar = false;
    var gameId = $stateParams.gameId;
    var groupId = $stateParams.groupId;
    vm.currentUser = localStorage.get('user');
    vm.backToMain = backToMain;
    vm.showBottomMenu = true;
    vm.changeActiveTab = changeActiveTab;
    vm.registered = false;
    vm.showButtonModal = false;
    vm.invitePlayers = []


    if(!vm.activeTab) vm.activeTab = 'info';    
    vm.currentUser = localStorage.get('user');
    $scope.$on('user:login', function() {
      vm.currentUser = localStorage.get('user');
      
      console.log('user from logging in', vm.currentUser)
      
    });
    

    if(groupId) {
      console.log('game component has groupId: ', groupId)
      groupsService.getGroup(groupId)
        .then((group) => {
          vm.group = group.data.data;
          // console.log(vm.group);
          vm.optionalPlayers = vm.group.members;
          vm.game = {};
          vm.game.players = [{userName: vm.currentUser.userName, userId: vm.currentUser._id}];
          vm.game.platformType = vm.group.mainPlatform
          vm.game.optionalPlayers = [];
          vm.game.host = vm.currentUser.userName
          vm.game.time = new Date(Date.now());
          vm.game.timeoptions =[];
          vm.today = new Date(Date.now())
          vm.group = '';
          vm.showBottomToolBar = true;
          vm.showButtonModal = true;
          
          
        })
    } 

    else if (gameId) {
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
        
        console.log(vm.registered)
        $log.debug('game', vm.game);
        
        // $scope.$apply();
        if(vm.game.group){

          groupsService.getGroup(vm.game.group)
            .then((data) => {
              vm.optionalPlayers = data.data.data.members
              console.log(vm.optionalPlayers);
              // $scope.$apply();
            })
        } else{
          vm.optionalPlayers = vm.currentUser.friends
        }
      })
      .catch(function(err) {
        $log.debug(err);
      });
    } else {
      vm.game = {};
      vm.game.players = [{userName: vm.currentUser.userName, userId: vm.currentUser._id}];
      vm.game.optionalPlayers = [];
      vm.game.host = vm.currentUser.userName
      vm.game.time = new Date(Date.now());
      vm.game.timeoptions =[];
      vm.today = new Date(Date.now())
      vm.group = '';
      vm.showBottomToolBar = true;
      vm.optionalPlayers = vm.currentUser.friends
      vm.showButtonModal = true;
    }

    var state = $state.current.name;
    console.log(vm.optionalPlayers)
   
    

    vm.actionType = setActionType(state, gameId);
    console.log('actionType: ', vm.actionType) 

    platformService.getAllPlatformsFromDataBase()
      .then((platforms) => {
        vm.platforms = platforms.data.data;
        console.log('platforms:', vm.platforms)
        
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

    
    function changeActiveTab(tab){
      vm.activeTab = tab
    } 

    function clearSearchTerm(){
      vm.searchTerm = ''
    }
      
      
    function selectGameType(typeName){
      
      vm.game.gameType = typeName
      
      if(vm.game.gameType == "1V1"){
        addGroupsToGame(1);
        // vm.game.gameGroups[0].groupMembers[0].userName = vm.currentUser.userName
        // addPlayerToGroup(0, vm.currentUser.userName);
      }
      if(vm.game.gameType == "2V2"){
        addGroupsToGame(2);
        // vm.game.gameGroups[0].groupMembers[0].userName = vm.currentUser.userName
      }
      if(vm.game.gameType == "1 Vs many"){
        vm.game.gameGroups = [];
        
      }
    } 
    
    function addGroupsToGame(PlayersPerGroup){
      vm.game.PlayersPerGroup = PlayersPerGroup
      vm.game.gameGroups = [];
      var numGroups = 2;
      for (var j=0; j<numGroups; j++){
        var group = {
          groupNumber : j+1,
          groupMembers: []
        }
        for (var i=0; i<PlayersPerGroup; i++){
          group.groupMembers.push({userName: ''})
        
        }
        vm.game.gameGroups.push(group)
      }
      vm.game.gameGroups[0].groupMembers[0].userName = vm.currentUser.userName
      console.log(vm.game)
    }

    function takeThisPlace(index, groupNum){
      // console.log(index)
      vm.game.gameGroups[groupNum].groupMembers[index].userName = vm.currentUser.userName
      
      editGame(vm.game, vm.game._id, 'Added to game, GOOD LUCK!')
    }
    function removeFromThisPlace(index, groupNum){
      // console.log(index)
      vm.game.gameGroups[groupNum].groupMembers[index].userName = ''
      editGame(vm.game, vm.game._id, 'Removed from game, See you soon!')
    }

    function selectPlatformType(typeName){
      // console.log(typeName);
      // console.log(vm.game)

      vm.game.platformType = typeName
      console.log(vm.game);
      // $scope.$apply()
    }    
      
    
    function backToMain(){
      $state.go('displayUser', {userId: vm.currentUser._id} )
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

          Swal.fire({
            position: 'center',
            type: 'success',
            title: newGame.name + ' created, GOOD LUCK!',
            showConfirmButton: false,
            timer: 1200
          });
          $state.go('displayGame', { gameId: newGame._id });
          // var dialog = ngDialog.open({
          //   template: '\
          //     <p>New game created</p>\
          //     <div class="ngdialog-buttons">\
          //         <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'ok\')">OK</button>\
          //     </div>',
          //   plain: true
          // });

          // dialog.closePromise.then(function(closedDialog) {
          //   $state.go('displayGame', { gameId: newGame._id });
          // });

        })
        .catch(function(err) {
          $log.debug(err);
        });
    }

    
    
    vm.selectWinner = function(user){
      // console.log(user)
      vm.newWinner = {
        userName: user.userName, 
        userId: user.userId
      }
      console.log(vm.newWinner)
    }

    function editGame(game, gameId, responseMessage) {
      console.log('editing game', vm.newWinner, game.winner);
      if(!responseMessage) {
        var responsMessage = vm.game.name + 'updated!'
      }
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
          Swal.fire({
            position: 'center',
            type: 'success',
            title: responseMessage,
            showConfirmButton: false,
            timer: 1200
          });
          checkIfRegistered()


          var updatedGame = updatedGame.data.data;
          updatedGame.time = new Date(updatedGame.time)
          vm.game = updatedGame;
          console.log(vm.game);

          $log.debug('updatedGame', vm.updatedGame);
          
          // $state.go('displayGame', { gameId: vm.game._id });
          // ngDialog.open({
          //   template: '\
          //     <p>'+responseMessage+'</p>\
          //     <div class=\"ngdialog-buttons\">\
          //         <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
          //     </div>',
          //   plain: true
          // });

          

        })
        .catch(function(err) {
          $log.debug(err);
        });

         
    }

   
    function addPlayer(user){
      console.log(user)
      vm.game.players.push({userName: user.userName, userId: user.userId})
    }

    function removePlayer(index){
      
      vm.game.players.splice(index, 1);
      console.log(vm.game.players)
    }

    function invitePlayer(user){
      console.log(user)
    }

    function sendInvitationsToPlayers(){
      // vm.invitePlayers.push(user.userId)
      console.log(vm.invitePlayers);
      var message = {
        subject : 'New Game from ' + vm.currentUser.userName,
        content: vm.currentUser.userName + ' has invited you to a game ! ',
        messageType : 'gameInvite',
        sender : {userName: vm.currentUser.userName,
                  userId: vm.currentUser._id},
        
        links: {gameId: vm.game._id,
                userId: vm.currentUser._id,
                }
      }
      messagesService.createMessagePerUser(vm.invitePlayers, message)
        .then(function(message){
          console.log(message);
          Swal.fire({
            position: 'center',
            type: 'success',
            title: 'Invitations has been sent!',
            showConfirmButton: false,
            timer: 1200
          });
        });
    }
    function registerToGame() {
      
      if (!vm.game) return;
      console.log(vm.game)
      
      
      if(vm.inOptionalPlayers){
        vm.game.optionalPlayers = vm.game.optionalPlayers.filter(function(value){
          console.log(value)
          return value.userName != vm.currentUser.userName;
      
        });
        
      }

      if (vm.registered) {
        Swal.fire({
          position: 'error',
          type: 'success',
          title: 'You are allready registered to this game!',
          showConfirmButton: false,
          timer: 1200
        });
        // ngDialog.open({
        //   template: '\
        //     <p>You are allready registered to this game</p>\
        //     <div class=\"ngdialog-buttons\">\
        //         <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
        //     </div>',
        //   plain: true
        // });
      }
      else {
        vm.game.players.push({
          userName: vm.currentUser.userName,
          userId: vm.currentUser._id
        })
        console.log(vm.game);
        editGame(vm.game, vm.game._id, 'registered to '+ vm.game.name + ' at ' + vm.game.host);
      }
      
      
    }

    function unRegisterToGame() {
      
      if (!vm.game) return;
      if(vm.game.host == vm.currentUser.userName){
        Swal.fire({
          position: 'center',
          type: 'error',
          title: 'A host cant leave game without changing to another host',
          showConfirmButton: false,
          timer: 1200
        });
        // ngDialog.open({
        //   template: '\
        //     <p>A host cant leave game without changing to another host</p>\
        //     <div class=\"ngdialog-buttons\">\
        //         <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
        //     </div>',
        //   plain: true
        // });
      }else{
      vm.game.players = vm.game.players.filter(function(value){
        
        return value.userName != vm.currentUser.userName;
    
      });
      editGame(vm.game, vm.game._id, 'Unregistered '+ vm.currentUser.userName +' from '+ vm.game.gametype + ' at ' + vm.game.host)
    }
   
      
    }


    function addOptionalTime(){
      console.log(vm.game);
      vm.game.timeoptions.push({
        date: vm.timeOption,
        players: [{
          userName: vm.currentUser.userName,
          userid: vm.currentUser._id
        }]
      })

      var responsMessage = 'added '+ vm.timeOption + ' to time options'
      addToOptionalPLayers(responsMessage)
    }

    function addPlayerToTimeOption(time){
      console.log(time);
      var inArray = checkIfUserInArrayByUsername(time.players, vm.currentUser.userName)
      
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
          userName: vm.currentUser.userName,
          userid: vm.currentUser._id
        })
        editGame(vm.game, vm.game._id, vm.currentUser.userName + 'Added to optional time: '+ time.date +' for ' + vm.game.gametype + ' at '+ vm.game.host)
      }
      
    }

    function removePlayerfromTimeOption(time){
      console.log(time)
      time.players = time.players.filter(function(value){
        console.log(value)
        return value.userName != vm.currentUser.userName;
    
      });
      
      editGame(vm.game, vm.game._id, vm.currentUser.userName + ' removed from optional time: '+ time.date +' for ' + vm.game.gametype + ' at '+ vm.game.host)
    }

    function addToOptionalPLayers(responsMessage){
      var inArray = checkIfUserInArrayByUsername(vm.game.optionalPlayers, vm.currentUser.userName)

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
        vm.game.optionalPlayers.push({
          userName: vm.currentUser.userName, 
          userid: vm.currentUser._id
        });
        
        if(responsMessage) {
          editGame(vm.game, vm.game._id, responsMessage)
        } else{
          var responsMessage = 'added to tentative players';
          editGame(vm.game, vm.game._id, responsMessage)
        }
        
        // $scope.$apply()
      }

      
      
    }

    function removeFromOptionalPLayers(){
      var inArray = checkIfUserInArrayByUsername(vm.game.optionalPlayers, vm.currentUser.userName)
      
      if (inArray) {
        vm.game.optionalPlayers = vm.game.optionalPlayers.filter(function(value){
          console.log(value)
          return value.userName != vm.currentUser.userName;
      
        });
        editGame(vm.game, vm.game._id, vm.currentUser.userName +' removed from optional players for ' + vm.game.gametype + ' at '+ vm.game.host)
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
          // console.log(foundUser)
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
      
      var isOptional = checkIfUserInArrayByUsername(vm.game.optionalPlayers, vm.currentUser.userName)
      // console.log(isOptional)
      if (isOptional) vm.isOptional = true
      else vm.isOptional = false
      
    }

    function checkIfRegistered(){
      // console.log(vm.game.players, vm.currentUser.userName)
      var registerd = checkIfUserInArrayByUsername(vm.game.players, vm.currentUser.userName)
      // console.log(registerd)
      if (registerd) vm.registered = true
      else vm.registered = false
      vm.showButtonModal = true;
    }

    
    

  }

})();
