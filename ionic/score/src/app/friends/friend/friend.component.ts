import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/users/users.service';
import { User } from 'src/app/users/user.model';
import { GroupsService } from 'src/app/groups/groups.service';
import { SubSink } from 'node_modules/subsink/dist/subsink';
import { MessagesService } from 'src/app/messages/messages.service';
import { IonToastService } from 'src/app/shared/services/ion-toast.service';
@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit, OnDestroy {
  @Input()friend: any;
  @Input()index: any;
  @Input()user: User;
  @Input()bgColor: string;
  isUser: boolean;
  private subs = new SubSink();
  constructor(private groupsService: GroupsService,
              private messagesService: MessagesService,
              private toastService: IonToastService,
              private usersService: UsersService) { }

  ngOnInit() {
    this.isUser = this.usersService.checkIfUserIsCurrentUser(this.user._id);
    // console.log(this.friend);
    this.subs.sink = this.usersService.getUserFromDb(this.friend.userId)
      .subscribe((friend: any) => {
        this.friend = friend.data;
        // console.log(this.friend)
      });
    this.subs.sink = this.groupsService.getGroupsByUserID(this.user._id)
      .subscribe((groups: any) => {
          // console.log(groups)
          this.friend.sharedGroups = this.findSharedGroupsWithUser(groups.data, this.friend._id);
      });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  sendMessageToUser(text) {
    this.messagesService.sendMessageToUser(this.friend, this.user, text, '')
      .subscribe(returnMessage => {
        if (returnMessage) {
          console.log(returnMessage)
          this.toastService.ionToastSubject.next({
            message: 'Message sent to ' + this.friend.userName
          });
        }
      });
  }

  removeFriend(index, user) {
    console.log(index, user);
    user.friends.splice(index, 1);
    this.usersService.updateUser(user)
      .subscribe((updatedUser: any) => {
        console.log(updatedUser.data);
      });
  }

  findSharedGroupsWithUser(groupsArray: any, userId: string) {
    // console.log(groupsArray.length, user)
    const sharedGroups = [];
    for (const group of groupsArray) {
      // console.log(groupsArray[i])
      for (const member of group.members) {
        // console.log(groupsArray[i].members[j].userId, user)
        if (member.userId === userId) {
          // console.log('foundShared group')
          sharedGroups.push(group);
          // console.log(sharedGroups)
        }
      }
    }
    // console.log(sharedGroups)
    return sharedGroups;

  }



}
