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
  
      messageRowDirective.$inject = ['$rootScope', '$q', '$injector','messagesService','$state'];
  
    function messageRowDirective($rootScope, $q, $injector, messagesService, $state) {
        
        return {
            templateUrl: 'app/_shared/directives/messageRowDirective/messagerow.directive.htm',
            link: function (scope, element, attributes) {
                // console.log(attributes);
                // scope.message = {};
                scope.box = attributes.box
                scope.linkTo = linkTo;
                scope.reply = reply;
                // scope.openReplyForm = openReplyForm;
                scope.messageClicked = messageClicked; 
                scope.openReplyFormFromContent = openReplyFormFromContent;
                scope.openReplyFormFromMain = openReplyFormFromMain;    
                
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
                        
                        linkToGroup(scope.message.links.groupId);
                    } else if(scope.message.links.gameId){
                       
                        linkToGame(scope.message.links.gameId);
                    }
                    
                }
                function linkToTournament(tourId){
                    $state.go('displayTournament', {tournamentId: tourId});
                }
                function linkToGroup(groupId){
                    $state.go('displayGroup', {groupId: groupId});
                }
                function linkToGame(gameId){
                    $state.go('displayGame', {gameId: gameId});
                }

                function openReplyFormFromMain(event){
                    // console.log(event);
                    var replyFormElement = angular.element(event.currentTarget.parentElement.parentElement.parentElement.parentElement.lastElementChild);
                    replyFormElement.toggleClass('hidden');

                }
                function openReplyFormFromContent(event){
                    // console.log(event.currentTarget.parentElement.parentElement.parentElement.lastElementChild);
                    var replyFormElement = angular.element(event.currentTarget.parentElement.parentElement.parentElement.lastElementChild);
                    replyFormElement.toggleClass('hidden');

                }

                function reply(message, replyText){
                    console.log(message, replyText);
                    var newMessage = {
                        subject: message.subject,
                        messageType: 'replyMessage',
                        content: replyText,
                        sender: message.receiver,
                        receiver: message.sender,
                        sentAt: Date.now(),
                        parentMessageId: message._id
                    }
                    message.status = 'unread';
                    messagesService.createMessage(newMessage)
                        .then(function(newMessage){
                            console.log(newMessage.data.data);
                            $rootScope.$broadcast('messagesSent', [newMessage.data.data]);
                            Swal.fire({
                                position: 'center',
                                type: 'success',
                                title: 'message has been sent',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        })
                    
                    // messagesService.updateMessage(message)
                    //     .then(function(updatedMessage){
                    //         console.log(updatedMessage);
                    //     })
                }

                function messageClicked(event,message, box){
                    // console.log(event);
                    // console.log(event.currentTarget.parentElement)
                    var content = angular.element(event.currentTarget.parentElement.nextElementSibling);
                    var replies = angular.element(event.currentTarget.parentElement.parentElement.children[2]);
                    // console.log(replies);

                    replies.toggleClass('contentHidden');
                    content.toggleClass('contentHidden');
                    if(box == 'inbox'){
                      changeMessageStatus(message, 'read')
              
                    }
                    
                  }

               function changeMessageStatus(message, newStatus){
                if (message.status == 'unread'){
                    message.status = newStatus;
                    
                    messagesService.updateMessage(message)
                    .then(function(message){
                        
                        // console.log($scope.$parent.$parent.$parent.vm.sumUnreadMessages);
                        scope.$parent.$parent.$parent.vm.sumUnreadMessages -= 1;
                        
                    })
                }

                }
                
            },
            
        };

       
    }
  })();
  