import { Component, OnInit, OnDestroy } from '@angular/core';
import { Account } from './account.model';
import { AccountsService } from './accountsService';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { listAnimation, moveInUp, moveInLeft } from '../shared/animations';
import { Params, ActivatedRoute } from '@angular/router';
import { localStorageService } from '../shared/services/local-storage.service';
import { SubSink } from 'node_modules/subsink/dist/subsink';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  animations: [listAnimation, moveInUp, moveInLeft]
})
export class AccountsComponent implements OnInit, OnDestroy {
  user: User;
  accounts: Account[];
  id: string;
  actions: any;
  loaded = false;
  currentUser: any;
  showSwitchButton = true;
  showAccounts = 'All accounts';
  isUser: boolean;
  private subs = new SubSink();
  constructor(private accountsService: AccountsService,
              private usersService: UsersService,
              private localStorage: localStorageService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    // this.actions= [
    //   {name: 'Edit', color: 'green', icon: 'edit'},
    //   {name: 'Invite', color: 'green', icon: 'home'},
    //   {name: 'Start', color: 'orange', icon: 'user'},
    //   {name: 'Message', color: 'black', icon: 'shopping-cart'},

    // ];
    this.subs.sink = this.accountsService.accountDeleted
      .subscribe(deletedAccount => {
        this.removeAccount(deletedAccount._id);
      });
    this.currentUser = this.localStorage.get('currentUser');
    // this.subs.sink = this.usersService.userSelected
    // .subscribe((user: any) => {
    //   this.user = user;
    //   console.log('user in AccountsComponent sub', this.user);
    //   this.subs.sink = this.accountsService.getAccountsByUserID(this.user._id)
    //   .subscribe((accounts: any) => {
    //     console.log(accounts.data);
    //     this.accounts = accounts.data;
    //     this.loaded = true;
    //     });

    // });

    this.subs.sink = this.route.parent.params
        .subscribe(
          (params: Params) => {
            // console.log(params)
            this.id = params.userId;
            this.subs.sink = this.usersService.getUserFromDb(this.id)
              .subscribe((user: any) => {
                // console.log(user.data)
                this.user = user.data;
                console.log('user in AccountsComponent from server', this.user);
                this.isUser = this.usersService.checkIfUserIsCurrentUser(this.user._id);
                this.subs.sink = this.accountsService.getAccountsByUserID(this.user._id)
                  .subscribe((accounts: any) => {
                    console.log(accounts.data);
                    this.accounts = accounts.data;
                    this.loaded = true;
                  });

              });
          }
        );





  }

  removeAccount(accountId) {
    this.accounts = this.accounts.filter((account: any) => {
      console.log(account._id, accountId);
      return account._id !== accountId;
    });

    console.log(this.accounts);
  }

  showActiveAccounts() {
    this.showAccounts = 'Active accounts';
  }

  showAllAccounts() {
    this.showAccounts = 'All accounts';
  }


  createAccount(account) {
    console.log('create account');
    account.userId = this.currentUser._id;
    this.subs.sink = this.accountsService.createAccount(account)
      .subscribe((newAccount: any) => {
        console.log(newAccount);
      });
  }

  searchGroups() {
    console.log('searching groups');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
