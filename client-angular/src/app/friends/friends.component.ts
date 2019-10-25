import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../users/user.model';
import { UsersService } from '../users/users.service';
import { GroupsService } from '../groups/groups.service';
import { ActivatedRoute, Params } from '@angular/router';
import { listAnimation, moveInUp } from '../shared/animations'
import { SubSink } from 'node_modules/subsink/dist/subsink'




@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
  animations:[listAnimation, moveInUp]
})
export class FriendsComponent implements OnInit, OnDestroy {
  user:User;
  id:string;
  dataLoaded:boolean;
  loaded:boolean = false;
  actions:any;
  showSwitchButton: boolean = true;
  showFriends:string = 'All friends'
  private subs = new SubSink();

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    ) { 

    }

  ngOnInit() {
    // this.actions= [
    //   {name: 'Filter', color: 'purple', icon: 'filter', },
    //   {name: 'Search', color: 'purple', icon: 'search', },
    // ];
    this.subs.sink = this.usersService.userSelected
    .subscribe((user:any)=>{
      this.user = user;
      console.log('user in AccountsComponent sub', this.user);
      this.loaded = true;
      
  
    })
    this.subs.sink = this.route.parent.params
        .subscribe(
          (params: Params) => {
            // console.log(params)
            this.id = params['userId'];
            this.subs.sink = this.usersService.getUserFromDb(this.id)
              .subscribe((user:any) => {
                // console.log(user.data)
                this.user = user.data
                console.log('user in FriendsComponent from server', this.user);
                this.loaded = true;
  
              })
          }
        );
    
    // this.getUser()
    //   .then(user => {
    //     this.user = user;
    //     console.log('user in FriendsComponent', this.user);
    //   })
    
    
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  };
  
  showOnlineFriends(){
    this.showFriends = 'Online friends'
    
  }
  showAllFriends(){
    this.showFriends = 'All friends'
  }
  

  searchFriends(){
    console.log(this.user);
    
    // console.log('friends', this.user.friends)
  }

  

}
