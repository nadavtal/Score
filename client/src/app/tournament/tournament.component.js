;(function() {

  'use strict';

  angular
    .module('boilerplate')
    .component('tournament', {
      bindings: {
        tournamentId: '<'
      },
      templateUrl: 'app/tournament/tournament.html',
      controllerAs: 'vm',
      controller: TournamentCtrl
    });

  TournamentCtrl.$inject = ['$log', '$state', '$stateParams', 'QueryService', 'localStorage', 'usersService', 'tournamentsService', 'groupsService', 
    'ngDialog', '$rootScope', '$scope', 'platformService', 'messagesService'];

    
    function TournamentCtrl($log, $state, $stateParams, QueryService, localStorage, usersService, tournamentsService, groupsService,
      ngDialog, $rootScope, $scope, platformService, messagesService){

    console.log('initializing TournamentCtrl', $scope)
    var vm = this;
    var groupId = $stateParams.groupId;
    // methods
    vm.selectWinner = selectWinner;
    vm.changeActiveTab = changeActiveTab;
    vm.createTournament = createTournament;
    vm.editTournament = editTournament;
    vm.submitTournamentForm = submitTournamentForm;
    vm.addPlayer = addPlayer;
    vm.removePlayer = removePlayer;
    vm.addAll = addAll;
    vm.registerToTournament = registerToTournament;
    vm.unRegisterToTournament = unRegisterToTournament;
    vm.initializeWinners = initializeWinners;
    vm.calculatePrize = calculatePrize;
    vm.calculatePrizePool = calculatePrizePool;
    vm.backToMain = backToMain;
    // vm.addOptionalTime = addOptionalTime;
    // vm.addToOptionalPLayers = addToOptionalPLayers;
    // vm.removeFromOptionalPLayers = removeFromOptionalPLayers;
    // vm.addPlayerToTimeOption = addPlayerToTimeOption;
    // vm.selectTournamentType = selectTournamentType
    // vm.selectPlatformType = selectPlatformType
    // vm.removePlayerfromTimeOption = removePlayerfromTimeOption;
    // vm.clearSearchTerm = clearSearchTerm;
    // vm.searchTerm = '';
    // vm.showBottomToolBar = false;

    vm.$onInit = function() {
      var tournamentId = $stateParams.tournamentId;
      
      vm.activeTab = 'info';
      vm.currentUser = localStorage.get('user') || {};
      var state = $state.current.name;
        console.log('state: ', state);
      vm.actionType = setActionType(state, tournamentId);
      console.log('actionType: ', vm.actionType) 
      vm.privacyOptions = ['public', 'friends', 'group', 'private']
      platformService.getAllPlatformsFromDataBase()
        .then((platforms) => {
          vm.platforms = platforms.data.data;
          // console.log('platforms:', vm.platforms)
          
          });
      if(groupId) {
        console.log('tournament component has groupId: ', groupId)
        groupsService.getGroup(groupId)
          .then((data) => {
            vm.group = data.data.data;
            vm.optionalPlayers = vm.group.members;
            console.log('vm.optionalPlayers:', vm.optionalPlayers);
            
            console.log('initializing new tournament object')
            vm.tournament = {};
            vm.tournament.name
            vm.tournament.manager = vm.currentUser.userName;
            vm.tournament.platform = ''
            vm.tournament.maxPlayers = 32;
            vm.tournament.playerPerBattle = 2;
            vm.tournament.rounds = calcNumRounds(vm.tournament.maxPlayers, vm.tournament.playerPerBattle);
            vm.tournament.buyIn = 100;
            vm.tournament.placesPaid = 4;
            vm.tournament.winners = [];
            vm.tournament.registered = [];
            vm.tournament.prizePool = vm.tournament.registered.length * vm.tournament.buyIn;
            vm.tournament.optionalPlayers = [];
            vm.tournament.winsToWinRound = 3;
            vm.tournament.winner = '';
            vm.tournament.time = new Date(Date.now());
            vm.tournament.timeoptions =[];
            vm.today = new Date(Date.now());
            vm.tournament.group = vm.group._id;
            vm.showBottomToolBar = true;
      
            console.log(vm.tournament);
          })
      } 
        
  
      else if (tournamentId) {
        
        tournamentsService.getTournament(tournamentId)
        .then(function(tournament) {
          
          vm.tournament = tournament.data.data;
          vm.tournament.time = new Date(vm.tournament.time);
          vm.timeOption = new Date(vm.tournament.time);
          vm.showBottomToolBar = true;
          if(!vm.tournament.prizePool) vm.tournament.prizePool = vm.tournament.registered.length * vm.tournament.buyIn;
          console.log('tournament', vm.tournament);
          if(vm.tournament.group){
            
            groupsService.getGroup(vm.tournament.group)
              .then((data) => {
                vm.group = data.data.data;
                vm.optionalPlayers = vm.group.members;
                // console.log('vm.optionalPlayers:', vm.optionalPlayers);
              })
          }
          if(!vm.tournament.tree){
            
            initializeTournament(vm.tournament);
          } else{
            vm.tournamentStructureObj = JSON.parse(vm.tournament.tree);
          };

          
          checkIfRegistered(vm.tournamentStructureObj);
          // checkIfInOptionalPlayer();
          console.log('registered: ', vm.registerd);
          console.log('tournamentStructureObj: ', vm.tournamentStructureObj);
          getWinners(vm.tournamentStructureObj);
          getLosers(vm.tournamentStructureObj);
          $log.debug('tournament', vm.tournament);
          
        })
        .catch(function(err) {
          $log.debug(err);
        });
      } else {
        vm.optionalPlayers = vm.currentUser.friends;
        console.log('initializing new tournament object')
        vm.tournament = {};
        vm.tournament.name
        vm.tournament.manager = vm.currentUser.userName;
        vm.tournament.platform = ''
        vm.tournament.maxPlayers = 32;
        vm.tournament.playerPerBattle = 2;
        vm.tournament.rounds = calcNumRounds(vm.tournament.maxPlayers, vm.tournament.playerPerBattle);
        vm.tournament.buyIn = 100;
        vm.tournament.placesPaid = 0;
        vm.tournament.winners = [];
        vm.tournament.registered = [];
        vm.tournament.prizePool = vm.tournament.registered.length * vm.tournament.buyIn;
        vm.tournament.optionalPlayers = [];
        vm.tournament.winsToWinRound = 3;
        vm.tournament.winner = '';
        vm.tournament.time = new Date(Date.now());
        vm.tournament.timeoptions =[];
        vm.today = new Date(Date.now());
        vm.tournament.group = 'no group';
        vm.showBottomToolBar = true;
  
        console.log(vm.tournament);
       
        
      }
  
    
  
    };
    
  function changeActiveTab(tab){
    vm.activeTab = tab
  } 

  function initializeTournament(){
    // console.log(vm.tournament.registered)
    vm.tournamentStructureObj = createTournamentStrctureObj(vm.tournament);
    vm.tournament.rounds = calcNumRounds(vm.tournament.maxPlayers, vm.tournament.playerPerBattle);
    vm.firstRoundBattles = drawFirstRound(vm.tournament.registered, vm.tournament.playerPerBattle);
    vm.tournamentStructureObj[0] = vm.firstRoundBattles;
    
  }  
  
  function calcNumRounds(numPlayers, playerPerBattle){
      var numRounds = 0;
      while(numRounds < 100){
        numPlayers = numPlayers/playerPerBattle;
        numRounds ++;
        // console.log(numPlayers, numRounds)
        if (numPlayers == 1){
          break
          // 
        }
      }
      return  numRounds
  }

  function drawFirstRound(users, playerPerBattle){
    var userCopy = JSON.parse(JSON.stringify(users));
    var numBattles = userCopy.length / playerPerBattle;
    // console.log(userCopy.length)
    var battles = [];
    for(var i = 0; i < numBattles; i++){
      // console.log(users)
      var battle = { player1: {},
                    player2: {}
      };
      
      var randomIndex = Math.floor(Math.random()*userCopy.length);
      battle.player1 = userCopy[randomIndex];
      userCopy.splice(randomIndex, 1);
      var randomIndex2 = Math.floor(Math.random()*userCopy.length);
      battle.player2 = userCopy[randomIndex2];
      userCopy.splice(randomIndex2, 1);
      battles.push(battle)
    }
      
    return battles
  }

  function createTournamentStrctureObj(tournament){
    var tournamentStructureObj = {};
    var numUsers = tournament.maxPlayers;
    for (var i = 0; i< tournament.rounds; i++){

      tournamentStructureObj[i] = [];
      for(var j = 0; j< numUsers/2; j++){
        var battle = { player1: {},
                      player2: {},
                      winner: {}
        };
        tournamentStructureObj[i].push(battle);
       
      }
      numUsers = numUsers/2 
    }
    return tournamentStructureObj;
  }

  function selectWinner($index,$event, battle, player, currentRound){
    // console.log($event);
    battle.winner = player;
    
    movePlayerToNextRound($index, $event, player, currentRound);

    var element = $($event.currentTarget);
    // console.log(element);
    
    
  }

  function movePlayerToNextRound(index, $event, player, currentRound){

    // console.log($event);
    var element = $($event.currentTarget);
    // console.log(element);
    var nextRoundIndex = Math.floor(index/2);
    // element.addClass('moveRight');
    // console.log(nextRoundIndex);
    // console.log(index%2);
    if (vm.tournamentStructureObj[currentRound + 1 ]){
      if(index%2 === 0){
        vm.tournamentStructureObj[currentRound + 1 ][nextRoundIndex].player1 = player;
        // element.addClass('moveDown');
  
      } else{
        vm.tournamentStructureObj[currentRound + 1 ][nextRoundIndex].player2 = player;
        // element.addClass('moveUp');
      }
    } else{
      console.log('there are no more rounds');

    }
    
    // console.log(vm.tournamentStructureObj[currentRound + 1 ][nextRoundIndex]);
    console.log(vm.tournamentStructureObj);
    vm.tournament.tree = JSON.stringify(vm.tournamentStructureObj);
    
    tournamentsService.editTournament(vm.tournament)
      .then(tournament => {
        vm.tournament = tournament.data.data;
        console.log(vm.tournament);
      })
    
  }

  function getWinners(tourObj){
    console.log(tourObj);
    var winners = {};
    var rounds = Object.keys(tourObj).length;
    for (var i=0; i < rounds; i++){
      winners[i] =[]
      for(var j=0; j < tourObj[i].length; j++){
        winners[i].push(tourObj[i][j].winner)

      }
    }
    // console.log('winners', winners);
    console.log(vm.tournament.winners[1].userName)
    
    vm.tournament.winners[0].userName = winners[rounds-1][0].userName;
    vm.tournament.winners[0].userId = winners[rounds-1][0].userId;
    
    console.log(vm.tournament);
    
  }

  function getLosers(tourObj){
    console.log(tourObj);
    var losers = {};
    var rounds = Object.keys(tourObj).length;
    for (var i=0; i < rounds; i++){
      losers[i] =[]
      for(var j=0; j < tourObj[i].length; j++){
        if(tourObj[i][j].winner.userName == tourObj[i][j].player1.userName){
          losers[i].push(tourObj[i][j].player2)
        } else{
          losers[i].push(tourObj[i][j].player1)
        }
        

      }
    }
    console.log('losers', losers);

    vm.tournament.winners[1].userName = losers[rounds-1][0].userName;
    vm.tournament.winners[1].userId = losers[rounds-1][0].userId;
    console.log(vm.tournament);
  }

  function random_item(items){
  
    return items[Math.floor(Math.random()*items.length)];
        
  }

  function initializeWinners(numWinners){
    vm.tournament.winners = [];
    console.log(numWinners);
    for(var i=0; i<numWinners;i++){
      vm.tournament.winners[i] = {position: i+1,
                                  percentage: 0,
                                  prize: 0,
                                  userName: '',
                                  userId: ''};
    }

    
  }

  function sumPercetages(){
    var sum = 0;
    for(var i =0; i< vm.tournament.winners.length; i++){
      sum += vm.tournament.winners[i].percentage;
    }
    return sum
  }
    
  function calculatePrize(percentage, position) {
    var currentPercentage = sumPercetages();
    if (currentPercentage > 100){
      console.log('percentage has bigger the 100')
    }
    var prize = vm.tournament.prizePool *(percentage/100);
    vm.tournament.winners[position].prize = prize;
    console.log(vm.tournament);
  }  
    
  function calculatePrizePool(){
    var prizePool = vm.tournament.buyIn * vm.tournament.registered.length;
    // console.log(prizePool);
    vm.tournament.prizePool = prizePool;
    updateWinners();
    
  }
    
  function updateWinners(){
    // console.log(vm.tournament.winners);
    for(var i =0; i< vm.tournament.winners.length; i++){
      vm.tournament.winners[i].prize = vm.tournament.prizePool *(vm.tournament.winners[i].percentage/100)
    }
  }
   
  function submitTournamentForm(tournament, tournamentId) {
    console.log(vm.actionType);
    vm[vm.actionType](tournament, tournamentId);
  }

  
    

  function clearSearchTerm(){
    vm.searchTerm = ''
  }
    
    
  function selectTournamentType(typeName){
    // console.log(typeName);
    // console.log(vm.tournament)

    vm.tournament.tournamentType = typeName
    console.log(vm.tournament);
    // $scope.$apply()
  }  

  function selectPlatformType(typeName){
    // console.log(typeName);
    // console.log(vm.tournament)

    vm.tournament.platform = typeName
    console.log(vm.tournament);
    // $scope.$apply()
  }    
    
  

  

  function setActionType(state, tournamentId) {
    // console.log(state)
    if (state == 'editTournament')
      vm.actionType = 'editTournament';
    else if (state == 'createTournament')
      vm.actionType = 'createTournament';
    else if (state == 'createGroupTournament')
      vm.actionType = 'createTournament';
    else if (state == 'displayTournament')
      vm.actionType = 'displayTournament';
    else
      vm.actionType = 'loadTournament';
    // console.log(vm.actionType)
    return vm.actionType;
  }
  
  function createTournament(tournament) {
    tournament.rounds = calcNumRounds(vm.tournament.maxPlayers, vm.tournament.playerPerBattle);
    console.log(tournament);
    if (!tournament) return;
    

    tournamentsService.createTournament(tournament)
      .then(function(newTournament) {
        Swal.fire({
          position: 'center',
          type: 'success',
          title: 'New tournament created!',
          showConfirmButton: false,
          timer: 1200
        });
        newTournament = newTournament.data.data
        console.log(newTournament);
        var message = {
          subject : 'New Tournament from: ' + vm.group.groupName,
          content: 'Check out this tournament: ' +newTournament.name,
          messageType : 'groupMessage',
          sender : {userName: vm.currentUser.userName,
                    userId: vm.currentUser._id},
          receiver : {userName: vm.group.groupName,
                      userId: vm.group._id},
          links: {tournamentId: newTournament._id,
                  userId: vm.currentUser._id,
                  groupId: vm.group._id}
        }
        messagesService.createMessage(message)
          .then(function(message){
            console.log(message)
          });
        var newTournament = newTournament.data.data;
        $log.debug('newTournament', newTournament);

        Swal.fire({
          position: 'center',
          type: 'success',
          title: 'New tournament created!',
          showConfirmButton: false,
          timer: 1200
        });

        $state.go('displayTournament', { tournamentId: newTournament._id });
        // var dialog = ngDialog.open({
        //   template: '\
        //     <p>New tournament created</p>\
        //     <div class="ngdialog-buttons">\
        //         <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'ok\')">OK</button>\
        //     </div>',
        //   plain: true
        // });

        // dialog.closePromise.then(function(closedDialog) {
        //   $state.go('displayTournament', { tournamentId: newTournament._id });
        // });

      })
      .catch(function(err) {
        $log.debug(err);
      });
  }

    function backToMain(){
      $state.go('displayUser', {userId: vm.currentUser._id} )
    }

    function editTournament(tournament, tournamentId, responseMessage) {
      console.log('editing tournament', vm.newWinner, tournament.winner, responseMessage)
      if (!tournament) return;
      if(vm.newWinner && tournament.winner){
        if(vm.newWinner.userId != tournament.winner.userId){
          console.log('winner has been changed ', tournament.winner, 'vm.newWinner:' + vm.newWinner);
          $scope.$emit('selectNewWinner', tournament.winner, vm.newWinner);
          tournament.winner = vm.newWinner;
        }
      }
      
      if(vm.newWinner && !tournament.winner){
        console.log('winner has been declared ');
        $scope.$emit('selectWinner', vm.newWinner);
        tournament.winner = vm.newWinner;
      }
      // console.log(tournament);
      tournamentsService.editTournament(tournament)
      .then(tournament => {
        // console.log(tournament.data.data);
        vm.tournament = tournament.data.data;
        // console.log(vm.tournament);
        // checkIfRegistered()
        
        vm.tournament.time = new Date(vm.tournament.time)
        
        // console.log(vm.tournament);

        $log.debug('updatedTournament', vm.tournament);

        if(!responseMessage) responseMessage = vm.tournament.name + ' updated!'
        
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
      QueryService
        .query('PUT', 'tournaments/' + tournamentId, null, tournament)
        .then(function(updatedTournament) {
          checkIfRegistered()
          console.log(updatedTournament)

          var updatedTournament = updatedTournament.data.data;
          updatedTournament.time = new Date(updatedTournament.time)
          vm.tournament = updatedTournament;
          console.log(vm.tournament);
          // console.log('aksjdhakjshdkasjhd');
          Swal.fire({
            position: 'center',
            type: 'success',
            title: responseMessage,
            showConfirmButton: false,
            timer: 1500
          });
          $log.debug('updatedTournament', vm.updatedTournament);
          
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
      // console.log(user)
      vm.tournament.registered.push({userName: user.userName, userId: user.userId});
      calculatePrizePool();
    }

    function removePlayer(index){
      
      vm.tournament.registered.splice(index, 1);
      console.log(vm.tournament.players)
    }

    function addAll(){
      console.log(vm.optionalPlayers);
      for(var i=0; i<vm.optionalPlayers.length; i++){
        addPlayer(vm.optionalPlayers[i]);
      }
      
    }
    
    function registerToTournament() {
      
      if (!vm.tournament) return;
      console.log(vm.tournament)
      
      
      if(vm.inOptionalPlayers){
        vm.tournament.optionalPlayers = vm.tournament.optionalPlayers.filter(function(value){
          console.log(value)
          return value.userName != vm.user.userName;
      
        });
        
      }

      if (vm.registerd) {
        ngDialog.open({
          template: '\
            <p>You are allready registered to this tournament</p>\
            <div class=\"ngdialog-buttons\">\
                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
            </div>',
          plain: true
        });
      }
      else {
        vm.tournament.registered.push({
          userName: vm.currentUser.userName,
          userId: vm.currentUser._id
        })
        console.log(vm.tournament);
        editTournament(vm.tournament, vm.tournament._id, 'registered to '+ vm.tournament.name + ' GOOD LUCK '+ vm.currentUser.userName);
      }
      
      
    }

    function unRegisterToTournament() {
      
      if (!vm.tournament) return;
      
      vm.tournament.registered = vm.tournament.registered.filter(function(value){
        
        return value.userName != vm.currentUser.userName;
    
      });
      editTournament(vm.tournament, vm.tournament._id, 'Unregistered '+ vm.currentUser.userName)
    }
   
      
   



    function addOptionalTime(){
      console.log(vm.tournament);
      vm.tournament.timeoptions.push({
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
        editTournament(vm.tournament, vm.tournament._id, vm.user.userName + 'Added to optional time: '+ time.date +' for ' + vm.tournament.tournamenttype + ' at '+ vm.tournament.host)
      }
      
    }

    function removePlayerfromTimeOption(time){
      console.log(time)
      time.players = time.players.filter(function(value){
        console.log(value)
        return value.userName != vm.user.userName;
    
      });
      
      editTournament(vm.tournament, vm.tournament._id, vm.user.userName + ' removed from optional time: '+ time.date +' for ' + vm.tournament.tournamenttype + ' at '+ vm.tournament.host)
    }

    function addToOptionalPLayers(responsMessage){
      var inArray = checkIfUserInArrayByUsername(vm.tournament.optionalPlayers, vm.user.userName)

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
        vm.tournament.optionalPlayers.push({
          userName: vm.user.userName, 
          userid: vm.user._id
        });
        
        if(responsMessage) {
          editTournament(vm.tournament, vm.tournament._id, responsMessage)
        } else{
          var responsMessage = 'added to tentative players';
          editTournament(vm.tournament, vm.tournament._id, responsMessage)
        }
        
        // $scope.$apply()
      }

      
      
    }

    function removeFromOptionalPLayers(){
      var inArray = checkIfUserInArrayByUsername(vm.tournament.optionalPlayers, vm.user.userName)
      
      if (inArray) {
        vm.tournament.optionalPlayers = vm.tournament.optionalPlayers.filter(function(value){
          console.log(value)
          return value.userName != vm.user.userName;
      
        });
        editTournament(vm.tournament, vm.tournament._id, vm.user.userName +' removed from optional players for ' + vm.tournament.tournamenttype + ' at '+ vm.tournament.host)
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
      
      var isOptional = checkIfUserInArrayByUsername(vm.tournament.optionalPlayers, vm.user.userName)
      // console.log(isOptional)
      if (isOptional) vm.isOptional = true
      else vm.isOptional = false
      
    }

    function checkIfRegistered(){ 
      
      // console.log(vm.tournament.registered, vm.currentUser.userName)
      var registerd = checkIfUserInArrayByUsername(vm.tournament.registered, vm.currentUser.userName)
      // console.log(registerd)
      if (registerd) vm.registerd = true
      else vm.registerd = false
       
    }
    

  }

})();
