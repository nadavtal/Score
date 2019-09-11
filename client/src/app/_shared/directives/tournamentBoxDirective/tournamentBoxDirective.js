

;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('tournamentBoxDirective', tournamentBoxDirective);
  
    tournamentBoxDirective.$inject = ['$q', '$injector', 'utils', 'tournamentsService', '$log', '$interval'];
  
    function tournamentBoxDirective($q, $injector, utils, tournamentsService, $log, $interval) {
        
        return {
            templateUrl: 'app/_shared/directives/tournamentBoxDirective/tournamentBoxDirective.htm',
            link: function (scope, element, attributes) {
                
                scope.show = false;
                var currentUser = scope.$parent.vm.currentUser
                scope.registered = utils.findUserInArrayByUserName(scope.tournament.registered, currentUser.userName);
                // console.log(scope.registered)

                if(scope.registered){
                  scope.flipButtonCondition = true;
                } else{
                  scope.flipButtonCondition = false
                }
                // console.log(scope.registered);
                scope.show = true;
                scope.loading = false;
                scope.unRegisterToTournament = unRegisterToTournament;
                scope.registerToTournament = registerToTournament;

                function unRegisterToTournament(tournament) {
                    scope.loading = true;
                    if (!tournament) return;
                    
                    tournament.registered = tournament.registered.filter(function(value){
                      
                      return value.userName != currentUser.userName;
                  
                    });
                    console.log(tournament);
                    tournamentsService.editTournament(tournament)
                    .then(function(tournament){
                      // console.log(tournament.data.data);
                      scope.tournament = tournament.data.data;
                      console.log(scope.tournament);
                      scope.loading = false;
                      
                      scope.tournament.time = new Date(scope.tournament.time)
                      scope.registered = false;
                      // console.log(scope.tournament);
              
                      $log.debug('updatedTournament', scope.tournament);
              
                      if(!responseMessage) responseMessage = scope.tournament.name + ' updated!'
                      
                      
                      
                    })
                    .catch(function(err) {
                      $log.debug(err);
                    });
                    
                }

                function registerToTournament(tournament) {
                  scope.loading = true;
                  // console.log('aksjdhakjsdhkjahsjdh')
                    if (!tournament) return;
                    tournament = scope.tournament
                    tournament.registered.push({
                        userName: currentUser.userName,
                        userId: currentUser._id
                    })
                    console.log(tournament);
                    tournamentsService.editTournament(tournament)
                    .then(function(tournament){
                      // console.log(tournament.data.data);
                      scope.tournament = tournament.data.data;
                      console.log(scope.tournament);
                      scope.loading = false;
                      
                      scope.tournament.time = new Date(scope.tournament.time)
                      scope.registered = true;
                      // console.log(scope.tournament);
              
                      $log.debug('updatedTournament', scope.tournament);
              
                      if(!responseMessage) responseMessage = scope.tournament.name + ' updated!'
                     
                      
                      
                    })
                    .catch(function(err) {
                      $log.debug(err);
                    });
                    
                }


                //FOR MATERIAL PROGRESS LINEAR

                var j= 0, counter = 0;

                scope.mode = 'query';
                scope.activated = true;
                scope.determinateValue = 30;
                scope.determinateValue2 = 30;

                scope.showList = [];

                /**
                 * Turn off or on the 5 themed loaders
                 */
                scope.toggleActivation = function() {
                    if (!scope.activated) scope.showList = [];
                    if (scope.activated) {
                      j = counter = 0;
                      scope.determinateValue = 30;
                      scope.determinateValue2 = 30;
                    }
                };

                $interval(function() {
                  scope.determinateValue += 1;
                  scope.determinateValue2 += 1.5;

                  if (scope.determinateValue > 100) scope.determinateValue = 30;
                  if (scope.determinateValue2 > 100) scope.determinateValue2 = 30;

                    // Incrementally start animation the five (5) Indeterminate,
                    // themed progress circular bars

                    if ((j < 2) && !scope.showList[j] && scope.activated) {
                      scope.showList[j] = true;
                    }
                    if (counter++ % 4 === 0) j++;

                    // Show the indicator in the "Used within Containers" after 200ms delay
                    if (j == 2) scope.contained = "indeterminate";

                }, 100, 0, true);

                $interval(function() {
                  scope.mode = (scope.mode == 'query' ? 'determinate' : 'query');
                }, 7200, 0, true);
            }
        };
  
      
  
    }


  //   angular
  //     .module('boilerplate').directive('test', function() {
  //     return {
  //         restrict: 'E',
  //         scope: {
  //             color1: '=',
  //             updateFn: '&'
  //         },
  //         template: "<button ng-click='updateFn({msg:\"Hello World!\"})'>Click</button>",
  //         replace: true,        
  //         link: function(scope, elm, attrs) {             
  //         }
  //     }
  // });
  })();
  