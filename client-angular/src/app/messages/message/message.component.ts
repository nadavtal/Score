import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() message:any;
  @Input() box:string;
  @ViewChild('replyForm', {static: false}) replyForm: NgForm;
  showMessageContent:boolean = false;
  showReplyForm: boolean = false;

  constructor(private router: Router,
              private messagesService: MessagesService) { }

  ngOnInit() {
    console.log(this.messagesService);
  }
  
  linkTo(){
    console.log(this.message.links);
    if(this.message.links.tournamentId){
        this.linkToTournament(this.message.links.tournamentId);
    } else if(this.message.links.groupId){
        
        this.linkToGroup(this.message.links.groupId);
    } else if(this.message.links.gameId){
       
        this.linkToGame(this.message.links.gameId);
    }
  }

  linkToTournament(tourId){
      // $state.go('displayTournament', {tournamentId: tourId});
  }
  linkToGroup(groupId){
      // $state.go('displayGroup', {groupId: groupId});
  }
  linkToGame(gameId){
      // $state.go('displayGame', {gameId: gameId});
  }

  openReplyForm(event){
    this.showReplyForm = true
      // console.log(event);
      // var replyFormElement = angular.element(event.currentTarget.parentElement.parentElement.parentElement.parentElement.lastElementChild);
      // replyFormElement.toggleClass('hidden');

  }
  

  reply(message, replyText){
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
      this.messagesService.createMessage(newMessage)
          .subscribe((newMessage:any)=>{
            console.log(newMessage.data)
              console.log(this.messagesService);
              this.messagesService.newMessage.next(newMessage.data)
              // $rootScope.$broadcast('messagesSent', [newMessage.data.data]);
              // Swal.fire({
              //     position: 'center',
              //     type: 'success',
              //     title: 'message has been sent',
              //     showConfirmButton: false,
              //     timer: 1500
              // });
          })
      
      this.messagesService.updateMessage(message)
          .subscribe(function(updatedMessage){
              console.log(updatedMessage);
          })
  }

  messageClicked(event,message, box){
    this.showMessageContent = true;
      // console.log(event);
      // console.log(event.currentTarget.parentElement)
      // var content = angular.element(event.currentTarget.parentElement.nextElementSibling);
      // var replies = angular.element(event.currentTarget.parentElement.parentElement.children[2]);
      // console.log(replies);

      // replies.toggleClass('contentHidden');
      // content.toggleClass('contentHidden');
      if(box == 'inbox'){
        this.changeMessageStatus(message, 'read')

      }
      
    }

 changeMessageStatus(message, newStatus){
    if (message.status == 'unread'){
        message.status = newStatus;
        
        this.messagesService.updateMessage(message)
        .subscribe(function(message){
            
            // console.log($scope.$parent.$parent.$parent.vm.sumUnreadMessages);
            // scope.$parent.$parent.$parent.vm.sumUnreadMessages -= 1;
            
        })
    }

  }
    
  
}
