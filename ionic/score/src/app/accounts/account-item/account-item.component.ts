import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AccountsService } from '../accountsService';
import { SubSink } from 'node_modules/subsink/dist/subsink'
import { UsersService } from 'src/app/users/users.service';
@Component({
  selector: 'app-account-item',
  templateUrl: './account-item.component.html',
  styleUrls: ['./account-item.component.scss']
})
export class AccountItemComponent implements OnInit, OnDestroy {
  @Input() account: any;
  isUser: boolean;
  private subs = new SubSink();
  constructor(private accountService: AccountsService,
              private usersService: UsersService) { }

  ngOnInit() {
    this.isUser = this.usersService.checkIfUserIsCurrentUser(this.account.userId);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  turnToInactive(){
    this.account.active = false;
    this.account.inActiveReason = 'Turned off by user';
    this.subs.sink = this.accountService.updateAccount(this.account)
      .subscribe((updatedAccount: any)=>{
        console.log(updatedAccount);
        this.accountService.accountDeleted.next(updatedAccount.data)
      })
  }

}
