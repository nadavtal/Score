import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../../users.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../../user.model';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { localStorageService } from 'src/app/shared/services/local-storage.service';





@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  roles = [];
  id:string;
  user:User;
  loaded:boolean = false;
  editMode:boolean = false;
  currentUser:any;
  @ViewChild('deleteSwal', {static: false}) private deleteSwal: SwalComponent;
  @ViewChild('userForm', {static: false}) private userForm: NgForm;
  
  constructor(
            private usersService: UsersService,
            private localStorage: localStorageService,
            private route: ActivatedRoute,
            
            
  ) { }

  ngOnInit() {
    this.currentUser = this.localStorage.get('currentUser');
    this.usersService.userSelected
      .subscribe((user:any)=>{
        this.user = user;
        console.log('user in InfoComponent sub', this.user);
        this.loaded = true;
      })
    this.route.parent.params
        .subscribe(
          (params: Params) => {
            console.log(params)
            this.id = params['userId'];
            this.usersService.getUserFromDb(this.id)
              .subscribe((user:any) => {
                // console.log(user.data)
                this.user = user.data;
                this.loaded = true;
                console.log('user in InfoComponent from server', this.user);
                
  
              })
          }
        );
    this.roles =  ['User', 'Admin'];
    
   
  }

  getUser(){
    return new Promise<User>((resolve, reject) => { 
      
      if(this.usersService.getUser()){
        const user = this.usersService.getUser();
        // console.log('user in FriendsComponent from getUser', this.user);
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
                // console.log('user in FriendsComponent from server', this.user);
                resolve(this.user)
  
              })
          }
        );
      };

    })
  }

  onSubmit(form:NgForm){
    console.log(this.user)
    // console.log(form.value);
    
    
  }

  deleteFile(something){
    console.log(something)
  }

  save(){
    console.log('saving')
  }
  remove(){
    console.log('removing')
  }

  editProfile(){
    this.editMode = !this.editMode
  }
  saveProfile(){
    this.editMode = !this.editMode;
    console.log(this)
    this.usersService.updateUser(this.user)
      .subscribe((upadtedUser:any)=>{
        this.user = upadtedUser.data
      })
  }

}
