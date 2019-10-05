import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from 'src/app/users/users.service';
import { User } from 'src/app/users/user.model';
import { GroupsService } from 'src/app/groups/groups.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit {
  @Input()friend: any;
  @Input()index:any
  @Input()user:User
  constructor(private groupsService: GroupsService,
              private userService: UsersService) { }

  ngOnInit() {
    // console.log(this.friend);
    this.userService.getUserFromDb(this.friend.userId)
      .subscribe((friend:any)=>{
        this.friend = friend.data;
        // console.log(this.friend)
      })
    this.groupsService.getGroupsByUserID(this.user._id)
      .subscribe((groups:any) => {
          // console.log(groups)
          this.friend.sharedGroups = this.findSharedGroupsWithUser(groups.data, this.friend._id);
          
       
      })
  }

  sendMessageToUser(user){
    console.log(user)
  }

  removeFriend(index, user){
    console.log(index, user)
  }

  findSharedGroupsWithUser(groupsArray:any, user:any){
    // console.log(groupsArray.length, user)
    var sharedGroups = []
    for (var i=0; i<groupsArray.length; i++){
      // console.log(groupsArray[i])
      for (var j=0; j< groupsArray[i].members.length; j++){
        // console.log(groupsArray[i].members[j].userId, user)
        if (groupsArray[i].members[j].userId == user){
          // console.log('foundShared group')
          sharedGroups.push(groupsArray[i])
          // console.log(sharedGroups)
        }
      }
    }
    // console.log(sharedGroups)
    return sharedGroups;

  }



}
