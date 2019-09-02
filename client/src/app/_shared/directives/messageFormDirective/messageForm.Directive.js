;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('messageFormDirective', messageFormDirective);
  
      messageFormDirective.$inject = ['$q', '$rootScope','messagesService','localStorage'];
  
    function messageFormDirective($q, $rootScope, messagesService, localStorage) {
        
        return {
            templateUrl: 'app/_shared/directives/messageFormDirective/messageForm.Directive.htm',
            link: function (scope, element, attributes) {
                
                scope.message = {
                    
                    receiver: {},
                    
                    sender: {},
                    messageType: '',
                };
                scope.currentUser = localStorage.get('user')     
                scope.message.links = {};
                scope.isDialog = false;


                if(scope.ngDialogData){
                    scope.isDialog = true;
                    console.log(scope.ngDialogData);
                    if(scope.ngDialogData.messageType){
                        scope.message.messageType = scope.ngDialogData.messageType;
    
                    }
                    

                    if(scope.ngDialogData.groups){
                        scope.groups = scope.ngDialogData.groups;

                    }

                    if(scope.ngDialogData.group){
                        
                        scope.group = scope.ngDialogData.group;
                        scope.message.receiver.userName = scope.group.groupName;
                        scope.message.receiver.userId = scope.group._id;
                                              
                        scope.message.links.groupId = scope.group._id;
                        scope.message.links.groupName = scope.group.groupName;
                        
                    }
                    if(scope.ngDialogData.receiver){
                        scope.message.receiver = {
                            userName : scope.ngDialogData.receiver.userName,
                            userId : scope.ngDialogData.receiver._id
                        };
                    }

                    if(scope.ngDialogData.sender){
                        scope.message.sender = {
                            userName : scope.ngDialogData.sender.userName,
                            userId : scope.ngDialogData.sender._id
                        };
                    }
                    
                   
                }
                if(!scope.message.sender.length){
                    scope.message.sender = {
                        userName: scope.currentUser.userName,
                        userId: scope.currentUser._id
                    }
                }
                console.log(scope.message);

                if(scope.message.messageType == 'groupInvite'){
                    scope.message.subject = 'Come join my group';
                    
                }

                if(scope.messageType == 'friendRequest'){
                    scope.message.subject = 'Come be my friend';
                }

                
                console.log(scope.group);

                scope.submitMessageForm = function(message){
                    console.log(message);
                                        
                    if(scope.group && scope.message.messageType == 'groupMessage'){
                        console.log('sending message to group: ', scope.group)
                        messagesService.createMessagePerUser(scope.group.members, message)
                            .then(function(data){
                                if(scope.isDialog){

                                    scope.closeThisDialog(0);
                                }
                                console.log(data);
                                Swal.fire({
                                    position: 'center',
                                    type: 'success',
                                    title: 'message has been sent to '+ message.receiver.userName,
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                            })
                        
                    } 

                    if(message.userReceiver){
                        message.messageType = 'privateChatMessage';
                        messagesService.createMessagePerUser(message.userReceiver, message)
                            .then(function(data){
                                if(scope.isDialog){

                                    scope.closeThisDialog(0);
                                }
                                console.log(data);
                                Swal.fire({
                                    position: 'center',
                                    type: 'success',
                                    title: 'message has been sent',
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                            })
                        // message.receiver = message.userReceiver
                        // console.log(message.receiver);
                        // messagesService.createMessage(message)
                        // .then(function(message) {
                        //     if(scope.isDialog){
                                
                        //         scope.closeThisDialog(0);
                        //     }
                        //     console.log(message);
                        //     if(message.statusText == 'Created'){
                        //         message = message.data.data;

                        //         Swal.fire({
                        //             position: 'center',
                        //             type: 'success',
                        //             title: 'message has been sent to '+ message.receiver.userName+' from: '+ message.sender.userName,
                        //             showConfirmButton: false,
                        //             timer: 1500
                        //         });

                        //     } else {
                        //         Swal.fire({
                        //             position: 'center',
                        //             type: 'error',
                        //             title: 'message could not been sent to '+ message.receiver.userName+' from: '+ message.sender.userName,
                        //             showConfirmButton: false,
                        //             timer: 1500
                        //         }) ;
                        //     }
                            
                        // });
                    }
                    
                    if(scope.message.sendToGroups){
                        console.log('sending message to groups: ', scope.message.sendToGroups)
                        message.messageType = 'groupMessage';
                        
                        messagesService.sendMessageToGroups(scope.message.sendToGroups, message)
                            .then(function(messages){
                                $rootScope.$broadcast('messagesSent', messages);
                            })
                   }     
                        
                   
                };

                scope.clearSearchTerm = function(){
                    
                };
                
                
            },
            // controller: messageFormControler,
            // controllerAs: 'vm'
        };

        // function messageFormControler($scope, $element, $attributes){
        //     console.log($scope);
        // }
  
      
  
    }
  })();
  