

;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('battleDirective', usersSelectDirective);
  
    usersSelectDirective.$inject = ['$q', '$injector'];
  
    function usersSelectDirective($q, $injector) {
        
        return {
            templateUrl: 'app/_shared/directives/battleDirective/battleDirective.htm',
            link: function (scope, element, attributes) {
                // console.log(attributes)
                scope.battle = JSON.parse(attributes.battle)
                scope.winner = []
                
                // console.log(scope.battle.team)
                getWinner(scope.battle.team[0], scope.battle.opponent[0]);
                if(scope.battle.team[1] && scope.battle.opponent[1]){

                    getWinner(scope.battle.team[1], scope.battle.opponent[1]);
                }
                

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

                // console.log('winner:', scope.winner)
                
            }
        };
  
      
  
    }
  })();
  