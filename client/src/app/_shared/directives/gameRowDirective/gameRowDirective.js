

;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('gameRowDirective', gameRowDirective);
  
    gameRowDirective.$inject = ['$q', '$injector'];
  
    function gameRowDirective($q, $injector) {
        
        return {
            templateUrl: 'app/_shared/directives/gameRowDirective/gameRowDirective.htm',
            link: function (scope, element, attributes) {
                console.log(scope)
                // scope.battle = JSON.parse(attributes.battle)
                scope.winner = []
                // console.log(scope.battle)
                // console.log(scope.battle.team)
                // getWinner(scope.battle.team[0], scope.battle.opponent[0]);
                // if(scope.battle.team[1] && scope.battle.opponent[1]){

                //     getWinner(scope.battle.team[1], scope.battle.opponent[1]);
                // }
                // scope.isWinner = checkIfIAmWinner();
                // console.log(scope.isWinner)
                


                function getWinner(player1, player2){
                    // console.log(player1)
                    
                    if(player1.crowns > player2.crowns){
                        scope.winner.push(player1)
                    } else if (player1.crowns < player2.crowns){
                        scope.winner.push(player2)
                    } else {
                        scope.winner='tide '+player1.crowns
                    }
                   
                }

                function checkIfIAmWinner(){
                    var isWinner = false;
                    var userName = scope.$parent.vm.user.name;
                    // console.log(userName)
                    for(var i =0; i< scope.winner.length; i++){
                        // console.log(scope.winner[i].name, userName)
                        if (scope.winner[i].name == userName){
                            // console.log('WINERERERERERERERER')
                            isWinner = true;
                        }
                    }
                    return isWinner
                }

                // console.log('winner:', scope.winner)
                
            }
        };
  
      
  
    }
  })();
  