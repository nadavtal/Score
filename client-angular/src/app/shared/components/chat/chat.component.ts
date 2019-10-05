import { Component, OnInit } from '@angular/core';
import { localStorageService } from '../../services/local-storage.service';
import { GroupsService } from 'src/app/groups/groups.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  currentUser: any;
  selectedUser: any;
  selectedGroup: any;
  groups:any;
  constructor(private localStorage: localStorageService,
              private groupsService: GroupsService) { }

  ngOnInit() {
    this.currentUser = this.localStorage.get('currentUser') ;
    this.groupsService.getGroupsByUserID(this.currentUser._id)
      .subscribe((groups:any)=> {
        this.groups = groups.data;
      })
  }

  chatWith(user){
    this.selectedUser = user;
    // socket2.emit('userLoggedIn', {
    //     currentUser: scope.vm.currentUser,
    //     user: scope.user
        
    // });
    // socket.emit('userLoggedIn', {
    //     currentUser: scope.vm.currentUser,
    //     user: scope.user
        
    // });
  }

  chatWithGroup(group){
    this.selectedGroup = group;
  }

}
