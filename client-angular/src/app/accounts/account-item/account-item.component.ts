import { Component, OnInit, Input } from '@angular/core';
import { AccountsService } from '../accountsService';

@Component({
  selector: 'app-account-item',
  templateUrl: './account-item.component.html',
  styleUrls: ['./account-item.component.scss']
})
export class AccountItemComponent implements OnInit {
  @Input() account:any
  constructor(private accountService: AccountsService) { }

  ngOnInit() {
  }

  turnToInactive(){
    this.account.active = false;
    this.account.inActiveReason = 'Turned off by user';
    this.accountService.updateAccount(this.account)
      .subscribe((updatedAccount:any)=>{
        console.log(updatedAccount);
        this.accountService.accountDeleted.next(updatedAccount.data)
      })
  }

}
