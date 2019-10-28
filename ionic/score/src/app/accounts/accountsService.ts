import { Injectable } from '@angular/core';

import { User } from '../users/user.model';
import { Subject } from 'rxjs';
import { Account } from './account.model';
import { QueryService } from '../shared/services/query.service';

@Injectable({providedIn: 'root'})
export class AccountsService {
    
    accountDeleted = new Subject<any>()
    constructor(private query: QueryService){}

    getAccounts(){
      return this.query.get('accounts');
    }

    // getAccount(id:number){
    //     return this.query.get();
    // }

    getAccountsByUserID(userId:string){
        return this.query.get('accounts/users/'+userId);
      }
    
    createAccount(account:any){
      return this.query.post('accounts/', account)
    }
    updateAccount(account:any){
      return this.query.put('accounts/'+account._id, account)
    }

    

    

    

      
}
