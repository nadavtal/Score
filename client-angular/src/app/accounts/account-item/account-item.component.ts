import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AccountsService } from '../accountsService';
import { SubSink } from 'node_modules/subsink/dist/subsink'
@Component({
  selector: 'app-account-item',
  templateUrl: './account-item.component.html',
  styleUrls: ['./account-item.component.scss']
})
export class AccountItemComponent implements OnInit, OnDestroy {
  @Input() account:any;
  private subs = new SubSink();
  constructor(private accountService: AccountsService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  turnToInactive(){
    this.account.active = false;
    this.account.inActiveReason = 'Turned off by user';
    this.subs.sink = this.accountService.updateAccount(this.account)
      .subscribe((updatedAccount:any)=>{
        console.log(updatedAccount);
        this.accountService.accountDeleted.next(updatedAccount.data)
      })
  }

}
