import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service'
import { ActivatedRoute, Params } from '@angular/router';
import { MessagesService } from './messages.service';
import { localStorageService } from '../shared/services/local-storage.service';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  id: string;
  messages: any;
  inboxMessages:any;
  outboxMessages:any;
  draftMessages:any;
  currentUser:any;
  loaded:boolean =false;
  actions:any;

  constructor(private usersService: UsersService,
              private messagesService: MessagesService,
              private localStorage: localStorageService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.actions = [
      {name: 'Search', color: 'pink', icon: 'search'},
      {name: 'Create', color: 'pink', icon: 'plus'},
    ]
    
    this.currentUser = this.localStorage.get('currentUser')
    this.route.parent.params
      .subscribe((params: Params)=> {
        console.log(params)
        if(params['userId']){
          this.id = params['userId'];
          this.messagesService.getMessagesByUserID(this.id)
            .subscribe((messages:any)=> {
              this.messages = messages.data;
              this.inboxMessages = this.findInboxMessages(this.messages)
              this.outboxMessages = this.findOutboxMessages(this.messages)
              console.log(this.inboxMessages)
              this.loaded = true;
            })
        }
      })
    // console.log('user in messagesComponent', this.user)
  }

  findInboxMessages(messages){
    console.log(messages)
    var inboxMessages = [];
    for(var i=0; i< messages.length; i++){
      console.log(messages[i].receiver.userId, this.currentUser._id)
      if(messages[i].receiver.userId == this.currentUser._id){
        inboxMessages.push(messages[i])
      }
    }
    return inboxMessages
  }
  findOutboxMessages(messages){
    var inboxMessages = [];
    for(var i=0; i< messages.length; i++){
      if(messages[i].sender.userId == this.currentUser._id){
        inboxMessages.push(messages[i])
      }
    }
    return inboxMessages
  }

}
