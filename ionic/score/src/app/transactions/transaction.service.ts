import { Injectable, OnInit } from "@angular/core";
import { QueryService } from '../shared/services/query.service';

@Injectable({providedIn: 'root'})
export class TransactionsService implements OnInit {
    transactionTypes: any
    constructor(private query : QueryService){}
    ngOnInit(){
        this.transactionTypes = ['Deposit', 'Withdraw', 'Wire']
    }

    createTransaction(transaction){
        return this.query.post('transactions', transaction)
    }
    getAllTransaction(transaction){
        return this.query.get('transactions')
    }
    getTransaction(tranactionId){
        return this.query.get('transactions/transaction/'+tranactionId)
    }
    getTransactionsByUserId(userId){
        return this.query.get('transactions/'+userId)
    }
}