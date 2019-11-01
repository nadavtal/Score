import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { Group } from '../group.model';
import { GroupsService } from '../groups.service';
import { Subject } from 'rxjs';
import { listAnimation, moveInUp, moveOutRight } from '../../shared/animations';
import { MessagesService } from 'src/app/messages/messages.service';
import { SubSink } from 'node_modules/subsink/dist/subsink';
import { User } from 'src/app/users/user.model';
import { IonToastService } from 'src/app/shared/services/ion-toast.service';

@Component({
  selector: 'app-group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss'],
  animations: [moveOutRight]
})
export class GroupItemComponent implements OnInit, OnDestroy {
  actions: any;
  
  @Input() group: any;
  @Input() currentUser: User;
  @Input() isUser: any;
  @Output()action = new Subject<any>();
  // @Input() id: number;
  private subs = new SubSink();


  constructor(private groupsService: GroupsService,
              private messagesService: MessagesService,
              private toastService: IonToastService,
              ) { }

  ngOnInit() {
  
    // this.actions= [
    //   {name: 'Edit ', color: 'blue', icon: 'edit'},
    //   {name: 'Delete', color: 'red', icon: 'trash', },



    //   ];
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  actionClicked(event) {
    console.log(event);
    if (event === 'Delete') {
      // this.action.next(event)
      this.deleteGroup();
    }
  }

  deleteGroup() {
    console.log('deleting group');
    this.subs.sink = this.groupsService.deleteGroup(this.group._id)
      .subscribe((data: any) => {
        // console.log(data);
        if (data.data.ok) {
          this.groupsService.groupDeleted.next(this.group._id);

        } else {
          console.log('error in deleting group');
        }
      });
  }

  sendMessage(text) {
    const message = {
      subject: text,
      messageType: 'groupMessage',
      sender: {
        userName: this.currentUser.userName,
        userId: this.currentUser._id
      }
    };
    this.messagesService.sendMessageToGroups([this.group], message)
      .then((messages: any) => {
        this.toastService.ionToastSubject.next({
          message: 'Message sent to ' + this.group.groupName,
          });
      });

  }

}
