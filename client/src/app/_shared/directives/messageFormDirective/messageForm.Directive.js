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
  
      messageFormDirective.$inject = ['$q', '$injector','messagesService','ngDialog'];
  
    function messageFormDirective($q, $injector, messagesService, ngDialog) {
        
        return {
            templateUrl: 'app/_shared/directives/messageFormDirective/messageForm.Directive.htm',
            link: function (scope, element, attributes) {
                console.log(scope.ngDialogData);
                scope.message = {};
                     
                scope.message.links = {};
                if(scope.ngDialogData){
                    if(scope.ngDialogData.messageType){
                        scope.messageType = scope.ngDialogData.messageType;
    
                    }else{
                        scope.messageType ="privatChatMessage";
                    }
                    if(scope.ngDialogData.receiver){
                        scope.receiver = scope.ngDialogData.receiver.userName;
                    } 

                }else{
                    scope.messageType ="privatChatMessage";
                }
                
                

                if(scope.messageType == 'groupInvite' && scope.ngDialogData.groups){
                    scope.groups = scope.ngDialogData.groups;
                    
                    
                    console.log(scope.groups);
                }

                if(scope.messageType == 'friendRequest'){
                    scope.message.subject = 'Come be my friend';
                }
                if(scope.messageType == 'groupMessage' && scope.ngDialogData.group){
                    scope.group = scope.ngDialogData.group;
                    scope.receiver = scope.ngDialogData.group.groupName;
                    if(scope.ngDialogData.groups){
                        scope.groups = scope.ngDialogData.groups;
                        
                        // console.log(scope.groups);
                    }
                }
                
                scope.pickReceiver = function(user){
                    user = JSON.parse(user);
                    // console.log(user);
                };

                console.log(scope.messageType, scope.group, scope.groups);

                scope.pickGroup = function(group){
                    // console.log(group);
                    scope.group = JSON.parse(group);
                    if(scope.messageType == 'groupInvite') {
                        scope.message.subject = 'Group invitation "'+ scope.group.groupName + '"';
                        scope.message.content = 'Come join my group: ' +scope.group.groupName;
                        scope.message.links.groupId = scope.group._id
                       
                        
                    }
                    else scope.message.subject = '';
                   
                };
                scope.submitMessageForm = function(message){
                    
                    
                    console.log(message);
                                        
                    if(scope.group && scope.messageType == 'groupMessage'){
                        message.messageType = scope.messageType;
                        message.receiver = {
                            userName: scope.group.groupName,
                            userId: scope.group._id}
                        message.sender = {
                            userName : scope.ngDialogData.sender.userName,
                            userId : scope.ngDialogData.sender._id,
                          }
                        
                        message.links.groupId = scope.group._id;
                        messagesService.createMessagePerUser(scope.group.members, message)
                            .then(function(data){
                                scope.closeThisDialog(0);
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
                    else {
                        
                        message.receiver = {
                            userName : scope.ngDialogData.receiver.userName,
                            userId : scope.ngDialogData.receiver._id
                        };
                        message.messageType = scope.messageType;
                        message.sender = {
                            userName : scope.ngDialogData.sender.userName,
                            userId : scope.ngDialogData.sender._id,
                        };

                        console.log(message);
                        messagesService.createMessage(message)
                            .then(function(message) {
                                scope.closeThisDialog(0);
                                console.log(message);
                                if(message.statusText == 'Created'){
                                    message = message.data.data;

                                    Swal.fire({
                                        position: 'center',
                                        type: 'success',
                                        title: 'message has been sent to '+ message.receiver.userName+' from: '+ message.sender.userName,
                                        showConfirmButton: false,
                                        timer: 1500
                                    });

                                } else {
                                    Swal.fire({
                                        position: 'center',
                                        type: 'error',
                                        title: 'message could not been sent to '+ message.receiver.userName+' from: '+ message.sender.userName,
                                        showConfirmButton: false,
                                        timer: 1500
                                    }) ;
                                }
                    
                        
                        // var dialog = ngDialog.open({
                        //     template: '\
                        //       <p>message has benn sent to '+ message.receiver.userName+' from: '+ message.sender.userName +'</p>\
                        //       <div class="ngdialog-buttons">\
                        //           <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'ok\')">OK</button>\
                        //       </div>',
                        //     plain: true
                        //   });
                    });
                        
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
  