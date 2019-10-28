import { Component, OnInit, OnDestroy } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { GroupsService } from './groups.service';
import { Utils } from '../shared/services/utils.service';
import { SubSink } from 'node_modules/subsink/dist/subsink';
import { UsersService } from '../users/users.service';

import { localStorageService } from '../shared/services/local-storage.service';

import { listAnimation, moveInUp, moveOutRight, moveInLeft } from '../shared/animations';
@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  animations: [listAnimation, moveInUp, moveOutRight, moveInLeft]
})
export class GroupsComponent implements OnInit, OnDestroy {
  actions: any;
  user: any;
  currentUser: any = this.localStorage.get('currentUser');
  id: string;
  groups: any[];
  managedGroups: any[];
  showGroups = 'Managed groups';
  loaded = false;
  showSwitchButton = true;
  dataLoaded = false;
  private subs = new SubSink();

  constructor(private route: ActivatedRoute,
              private usersService: UsersService,
              private groupsService: GroupsService,
              private localStorage: localStorageService,
              private utilsService: Utils,
              ) { }

  ngOnInit() {
    this.subs.sink = this.groupsService.groupDeleted
      .subscribe(groupId => {
        this.removeGroup(groupId);
      });
    this.actions = [
      {name: 'Filter', color: 'green', icon: 'filter', },
      ];
    this.subs.sink = this.groupsService.newGroupCreated.subscribe((newGroup: any) => {
      console.log('NEW GROUPPPP');
      this.groups.push(newGroup);
    });
    this.subs.sink = this.usersService.userSelected
    .subscribe((user: any) => {
      this.user = user;
      // console.log('user in GroupListComponent sub', this.user);
      
    this.subs.sink = this.groupsService.getGroupsByUserID(this.user._id)
        .subscribe((groups: any) => {
          this.groups = groups.data;
          // console.log(this.groups);
          // this.loaded = true;
        });
    this.subs.sink = this.groupsService.getGroupsManagedByUserID(this.user._id)
        .subscribe((managedGroups: any) => {
          this.managedGroups = managedGroups.data;
          console.log(this.managedGroups);
          this.loaded = true;
        });
  
    });
    this.subs.sink = this.route.parent.params
      .subscribe(
        (params: Params) => {
          if (params['userId']){
            this.id = params['userId'];
            this.subs.sink = this.usersService.getUserFromDb(this.id)
              .subscribe((user: any) => {
                // console.log(user.data)
                this.user = user.data;
                console.log('user in InfoComponent from server', this.user);
                this.subs.sink = this.groupsService.getGroupsByUserID(this.user._id)
                  .subscribe((groups: any) => {
                    this.groups = groups.data;
                    console.log(this.groups);
                    // this.loaded = true;
                  });
                this.subs.sink = this.groupsService.getGroupsManagedByUserID(this.user._id)
                  .subscribe((managedGroups: any) => {
                    this.managedGroups = managedGroups.data;
                    console.log(this.managedGroups);
                    this.loaded = true;
                  });
  
              });

          }else{
            this.subs.sink = this.groupsService.getGroups()
              .subscribe((groups: any) => {
                this.groups = groups.data;
                console.log(this.groups);
                this.showGroups = 'Registered groups';
                this.showSwitchButton = false;
                this.loaded = true;
              });
          }
        }
      );
    
            

    


  }

  actionFromGroupItem(event){
    console.log(event);
    
  }

  // pageHeaderActionClicked(actionName){
    
  //   if(actionName === 'Create group'){
  //     this.createNewGroup();
  //   }
  // }

  showOnlyManagedGroups(){
    this.showGroups = 'Managed groups';
  }
  showOnlyRegisteredGroups(){
    this.showGroups = 'Registered groups';
  }

  createNewGroup(data){
    const group  = data.values;
    
    group.groupManager = {userName : this.currentUser.userName,
      userId: this.currentUser._id};
      
    console.log(group);
    this.subs.sink = this.groupsService.createGroup(group)
      .subscribe((newGroup: any) => {
        console.log(newGroup);
        this.managedGroups.push(newGroup.data);
      });
  }

  removeGroup(groupId){
    this.groups = this.groups.filter(group => {
      console.log(group._id, groupId);
      return group._id !== groupId;
    });
    this.managedGroups = this.managedGroups.filter(group => {
      console.log(group._id, groupId);
      return group._id !== groupId;
    });
    console.log(this.managedGroups);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
