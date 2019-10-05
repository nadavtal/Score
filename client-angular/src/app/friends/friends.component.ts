import { Component, OnInit } from '@angular/core';
import { User } from '../users/user.model';
import { UsersService } from '../users/users.service';
import { GroupsService } from '../groups/groups.service';
import { ActivatedRoute, Params } from '@angular/router';
import { listAnimation, moveInUp } from '../shared/animations'





@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
  animations:[listAnimation]
})
export class FriendsComponent implements OnInit {
  user:User;
  id:string;
  dataLoaded:boolean;
  loaded:boolean = false;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    ) { 

    }

  ngOnInit() {

    this.usersService.userSelected
    .subscribe((user:any)=>{
      this.user = user;
      console.log('user in AccountsComponent sub', this.user);
      this.loaded = true;
      
  
    })
    this.route.parent.params
        .subscribe(
          (params: Params) => {
            // console.log(params)
            this.id = params['userId'];
            this.usersService.getUserFromDb(this.id)
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

  getUser(){
    return new Promise<User>((resolve, reject) => { 
      console.log(this.usersService.getUser())
      if(this.usersService.getUser()){
        const user = this.usersService.getUser();
        console.log('user in FriendsComponent from getUser', this.user);
        resolve(user)
        
      }else{
        this.route.parent.params
        .subscribe(
          (params: Params) => {
            // console.log(params)
            this.id = params['id'];
            this.usersService.getUserFromDb(this.id)
              .subscribe((user:any) => {
                // console.log(user.data)
                this.user = user.data
                console.log('user in FriendsComponent from server', this.user);
                resolve(this.user)
  
              })
          }
        );
      };

    })
  }

  

  searchFriends(){
    console.log(this.user)
    // console.log('friends', this.user.friends)
  }

  

}
