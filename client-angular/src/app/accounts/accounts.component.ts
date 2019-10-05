import { Component, OnInit } from '@angular/core';
import { Account } from './account.model';
import { AccountsService } from './accountsService';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { listAnimation, moveInUp } from '../shared/animations'
import { Params, ActivatedRoute } from '@angular/router';
import { localStorageService } from '../shared/services/local-storage.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  animations: [listAnimation]
})
export class AccountsComponent implements OnInit {
  user: User;
  accounts: Account[];
  id: string;
  actions:any;
  loaded:boolean = false;
  currentUser: any;

  constructor(private accountsService: AccountsService,
              private usersService: UsersService,
              private localStorage: localStorageService,
              private route: ActivatedRoute) {

    
   }

  ngOnInit() {
    // this.actions= [
    //   {name: 'Edit', color: 'green', icon: 'edit'},
    //   {name: 'Invite', color: 'green', icon: 'home'},
    //   {name: 'Start', color: 'orange', icon: 'user'},
    //   {name: 'Message', color: 'black', icon: 'shopping-cart'},
      
    // ];
    this.currentUser = this.localStorage.get('currentUser')
    this.usersService.userSelected
    .subscribe((user:any)=>{
      this.user = user;
      console.log('user in AccountsComponent sub', this.user);
      this.accountsService.getAccountsByUserID(this.user._id)
      .subscribe((accounts:any) => {
        console.log(accounts.data);
        this.accounts = accounts.data
        this.loaded = true;
        })
  
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
                console.log('user in InfoComponent from server', this.user);
                this.accountsService.getAccountsByUserID(this.user._id)
                  .subscribe((accounts:any) => {
                    console.log(accounts.data);
                    this.accounts = accounts.data;
                    this.loaded = true;
                  })
  
              })
          }
        );
  

    

   
  }
 

  createAccount(account){
    console.log('create account');
    account.userId = this.currentUser._id
    this.accountsService.createAccount(account)
      .subscribe((newAccount:any)=>{
        console.log(newAccount)
      })
  }

}
