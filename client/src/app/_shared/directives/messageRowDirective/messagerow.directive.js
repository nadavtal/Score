;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('messageRowDirective', messageRowDirective);
  
      messageRowDirective.$inject = ['$q', '$injector','messagesService','$state'];
  
    function messageRowDirective($q, $injector, messagesService, $state) {
        
        return {
            templateUrl: 'app/_shared/directives/messageRowDirective/messagerow.directive.htm',
            link: function (scope, element, attributes) {
                // console.log(scope);
                // scope.message = {};
                scope.linkTo = linkTo
                     
                
                if(scope.messageType ="privatChatMessage"){
                    
                }
                

                else if(scope.messageType == 'groupInvite'){
                    
                }

                else if(scope.messageType == 'groupMessage'){
                    
                }

                function linkTo(){
                    console.log(scope.message.links);
                    if(scope.message.links.tournamentId){
                        linkToTournament(scope.message.links.tournamentId);
                    } else if(scope.message.links.groupId){
                        console.log('aksjdhkajhsdk')
                        linkToGroup(scope.message.links.groupId);
                    }
                    
                }
                function linkToTournament(tourId){
                    $state.go('displayTournament', {tournamentId: tourId});
                }
                function linkToGroup(groupId){
                    $state.go('displayGroup', {groupId: groupId});
                }
               
                
            },
            
        };

       
    }
  })();
  