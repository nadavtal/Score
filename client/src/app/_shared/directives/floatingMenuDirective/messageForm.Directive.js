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
        console.log('messageFormDirective');
        return {
            templateUrl: 'app/_shared/directives/messageFormDirective/messageForm.Directive.htm',
            link: function (scope, element, attributes) {
                console.log(scope)
                scope.message = {}
                     
                scope.message.links = []
                if(scope.ngDialogData){
                    if(scope.ngDialogData.messageType){
                        scope.messageType = scope.ngDialogData.messageType;
    
                    }else{
                        scope.messageType ="chatMessage"
                    }
                    if(ngDialogData.receiver){
                        scope.receiver = ngDialogData.receiver.userName
                    } 

                }else{
                    scope.messageType ="chatMessage"
                }
                
                console.log(scope.messageType)

                if(scope.messageType == 'groupInvite' && scope.ngDialogData.groups){
                    scope.groups = scope.ngDialogData.groups;
                    
                    console.log(scope.groups)
                }

                if(scope.messageType == 'friendRequest'){
                    scope.message.subject = 'Come be my friend'
                }
                
                scope.pickReceiver = function(user){
                    user = JSON.parse(user)
                    console.log(user)
                }

                scope.pickGroup = function(group){
                    console.log(group);
                    scope.group = JSON.parse(group);
                    scope.message.subject = 'Come hoin our group "'+ scope.group.groupName + '"'
                    scope.message.links.push({
                        linkName: 'group',
                        linkId: scope.group._id})
                    console.log(scope.message)
                }
                scope.submitMessageForm = function(message){
                    console.log(message)
                    scope.closeThisDialog(0)
                    message.receiver = {
                        userName : scope.ngDialogData.receiver.userName,
                        userId : scope.ngDialogData.receiver._id
                    }
                    message.messageType = scope.messageType;
                    message.sender = {
                        userName : scope.ngDialogData.sender.userName,
                        userId : scope.ngDialogData.sender._id,
                    }
                    if(scope.group){
                        message.group = scope.group
                    }
                    
                    messagesService.createMessage(message)
                        .then((message) => {
                            console.log(message);
                            message = message.data.data
                            var dialog = ngDialog.open({
                                template: '\
                                  <p>message has benn sent to '+ message.receiver.userName+' from: '+ message.sender.userName +'</p>\
                                  <div class="ngdialog-buttons">\
                                      <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'ok\')">OK</button>\
                                  </div>',
                                plain: true
                              });
                        })
                    console.log(message)
                }

                scope.clearSearchTerm = function(){
                    
                }
                
                
            },
            // controller: messageFormControler,
            // controllerAs: 'vm'
        };

        // function messageFormControler($scope, $element, $attributes){
        //     console.log($scope);
        // }
  
      
  
    }
  })();
  