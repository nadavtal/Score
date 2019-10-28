import { Injectable, OnDestroy } from "@angular/core";
import { QueryService } from '../shared/services/query.service';
import { Subject } from 'rxjs';
import { SubSink } from 'node_modules/subsink/dist/subsink';
import { resolve, reject } from 'q';

@Injectable({providedIn: 'root'})
export class MessagesService implements OnDestroy {
  private subs = new SubSink();
    constructor(private query: QueryService) {}
    newMessage = new Subject<any>();

    ngOnDestroy() {
      this.subs.unsubscribe();
    }
    getMessage(messageId) {
        if (!messageId) { return; }

        return this.query.get('messages/' + messageId);
    }
    createMessage(message) {
        // console.log(message)
        if (!message) { return; }
        return this.query.post('messages/', message);
      }

    updateMessage(message) {
        if (!message) { return; }
        console.log('message before update', message);
        return this.query.put('messages/' + message._id, message);
      }

    getAllMessages() {
        return this.query.get('messages/');
      }

    getMessagesByPlatform(platformName) {
        return this.query.get('messages/platforms/' + platformName);
      }

    getMessagesByUserID(userId) {
        return this.query.get('messages/user/' + userId);
      }
    getMessagesByGroupId(groupId) {
        return this.query.get('messages/group/' + groupId);
      }

    checkIfMessageExists(message) {
        const promise = new Promise((resolve, reject) => {
          const messagetoUpaload = message

          .then((message: any) => {
            // console.log(message)
            if (message.data.name) {
              console.log('inDB');
              resolve(false);
            } else {
              resolve(messagetoUpaload);
            }
          });
        });

        return promise;
      }

    sendMessageToUser(toUser, fromUser) {
        console.log(fromUser, toUser);
        // toUser._id = toUser.userId
        const users = {
          sender: fromUser,
          receiver: toUser,
          messageType: 'privateChatMessage'
        };

      }

    sendMessageToGroup(group, fromUser, text) {
      const promise = new Promise((resolve, reject) => {
        const message: any = {
          subject : text,
          content: '',
          messageType : 'groupMessage',
          sender : {
              userName: fromUser.userName,
              userId: fromUser._id
          },
          links: {
            groupId: group._id,
            groupName: group.groupName
          }

        };

        this.createMessagePerUser(group, message)
          .then((createdMessages: any) => {
            resolve(createdMessages);
          }, error => {
            reject(error);
          });
      });
      return promise;
    }


    //    getGroupMessagesByUserId(userId, groups){
    //     var promise = new Promise((resolve, reject) =>{
    //       var groupMessages = []
    //       getClanAndBattles(userId)
    //       .then((data){
    //         // console.log(data);
    //         for(var i = 0; i<data.length; i++){
    //           findFriendlyBattles(data[i].data)
    //           .then((battles)=>{
    //             for(var j = 0; j<battles.length; j++){
    //               groupMessages.push(battles[j])
    //             }
    //             resolve(groupMessages)
    //           })
    //         }

    //       });
    //     })
    //     return promise
    //   }

    getMessagesFromGroups(groups) {
    const promiseArr = [];

    for (let i = 0; i < groups.length; i++) {
      const promise = new Promise((resolve, reject) => {
        this.subs.sink = this.getMessagesByGroupId(groups[i]._id)
          .subscribe((groupMessages: any) => {
            resolve(groupMessages.data.data);
        });

      });
      promiseArr.push(promise);
    }
    return Promise.all(promiseArr);
    }

    createMessagePerUser(users, msg) {
    // console.log(users)
    const promiseArr = [];

    for (let i = 0; i < users.length; i++) {
      const message = JSON.parse(JSON.stringify(msg));
      // console.log(message);
      const promise = new Promise((resolve, reject) => {
        // var message = msg;
        message.receiver = {
          userName: users[i].userName,
          userId: users[i].userId
        };


        this.subs.sink = this.createMessage(message)
          .subscribe((message: any) => {
            // console.log(message)
            resolve(message.data);
        });
      });
      promiseArr.push(promise);
    }
    return Promise.all(promiseArr);
    }

    sendMessageToGroups(groups, msg) {
    // console.log(users)
    const promiseArr = [];

    for (let i = 0; i < groups.length; i++) {

      // console.log(message);
      const promise = new Promise((resolve, reject) => {
        msg.links = {
          groupName: groups[i].groupName,
          groupId: groups[i]._id
        };
        this.createMessagePerUser(groups[i].members, msg)
          .then((messages) => {
            resolve(messages);
          }, err => {
            reject(err);
          });


      });
      promiseArr.push(promise);
      }
    return Promise.all(promiseArr);
    }

    sumUnreadMessages(messages) {

    let sum = 0;
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].status == 'unread') {
        sum++;
      }
    }
    // console.log(sum)
    return sum;
    }

    createLogMessage(action, content, receiver, links) {

      const message = {
        subject : action,
        content,
        messageType : 'log',
        sender : {
            userName: 'system',
            userId: ''
        },
        receiver : {
            userName: receiver.userName,
            userId: receiver._id
        },
        links,
      };
      if (!message) { return; }

      return this.query.post('messages/', message);
    }

    createNotificationMessage(action, content, receiver, links) {
      let recieverId;
      if (receiver._id) {
        recieverId = receiver._id;
      } else if (receiver.userId) {
        recieverId = receiver.userId;
      }
      const message = {
        subject : action,
        content,
        messageType : 'notification',
        sender : {
            userName: 'system',
            userId: ''
        },
        receiver : {
            userName: receiver.userName,
            userId: recieverId
        },
        links,
      };
      if (!message) { return; }

      return this.query.post('messages/', message);
    }

    sendInvitationMessage(itemType, item, fromUser, users, msgType) {
      const promise = new Promise((resolve, reject) => {
        const itemName = item.name ? item.name : item.groupName;
        const message: any = {
          subject : fromUser.userName + ' has invited you to join his ' + itemType + ': ' + itemName,
          content: '',
          messageType : msgType,
          sender : {
              userName: fromUser.userName,
              userId: fromUser._id
          },
          links: {
            itemType,
            itemId: item._id
          }

        };
        if (users) {

          this.createMessagePerUser(users, message)
            .then((createdMessages: any) => {
              resolve(createdMessages);
              // console.log('Created messages: ', createdMessages)
            });
        } else {
          reject('No users to send');
        }
      });


      return promise;
    }


}
