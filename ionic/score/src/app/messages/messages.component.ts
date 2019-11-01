import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../users/users.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MessagesService } from './messages.service';
import { localStorageService } from '../shared/services/local-storage.service';
import { SubSink } from 'node_modules/subsink/dist/subsink';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  id: string;
  messages: any;
  inboxMessages: any;
  outboxMessages: any;
  logMessages: any;
  notifications: any;
  invites: any;
  draftMessages: any;
  currentUser: any;
  user: any;
  loaded = false;
  actions: any;
  private subs = new SubSink();

  constructor(private usersService: UsersService,
              private messagesService: MessagesService,
              private localStorage: localStorageService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.actions = [
      {name: 'Search', color: 'pink', icon: 'search'},
      {name: 'Create', color: 'pink', icon: 'plus'},
    ];

    this.currentUser = this.localStorage.get('currentUser');
    this.subs.sink = this.route.parent.params
      .subscribe((params: Params) => {
        // console.log(params)
        if (params.userId) {
          this.id = params.userId;

          this.subs.sink = this.messagesService.getMessagesByUserID(this.id)
            .subscribe((messages: any) => {
              this.messages = messages.data;
              console.log(this.messages);
              this.inboxMessages = this.findInboxMessages(this.messages);
              this.outboxMessages = this.findOutboxMessages(this.messages);
              this.logMessages = this.allocateMessages(['log'], this.messages);
              this.notifications = this.allocateMessages(['notification'], this.messages);
              this.invites = this.allocateMessages(['gameInvite', 'tournamentInvite', 'friendRequest', 'groupInvite'], this.messages);
              this.loaded = true;
              console.log(this.invites);
            });
        }
      });
    // console.log('user in messagesComponent', this.user)
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  allocateMessages(msgTypes, messages) {
    const foundMessages = [];
    for (let i = 0; i < messages.length; i++) {

      if (messages[i].receiver.userId == this.currentUser._id && msgTypes.includes(messages[i].messageType)) {
        foundMessages.push(messages[i]);
      }
    }
    return foundMessages;
  }

  findInboxMessages(messages) {
    // console.log(messages)
    const inboxMessages = [];
    for (const message of messages) {
      // console.log(messages[i].receiver.userId, this.currentUser._id)
      if (message.receiver.userId === this.currentUser._id) {
        inboxMessages.push(message);
      }
    }
    return inboxMessages;
  }
  findOutboxMessages(messages) {
    const inboxMessages = [];
    for (const message of messages) {
      if (message.sender.userId === this.currentUser._id) {
        inboxMessages.push(message);
      }
    }
    return inboxMessages;
  }

  sumUnreadMessages(messages) {
    // console.log(messages)
    return this.messagesService.sumUnreadMessages(messages);
  }



}
