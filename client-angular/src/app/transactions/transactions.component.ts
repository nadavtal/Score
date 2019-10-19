import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { TransactionsService } from './transaction.service';
import { ActivatedRoute, Params } from '@angular/router';
import { listAnimation} from '../shared/animations'
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  animations: [listAnimation]
})
export class TransactionsComponent implements OnInit {
  user: any;
  loaded:boolean;
  transactions: any[]

  constructor(private usersService: UsersService,
              private route: ActivatedRoute,
              private transactionsService: TransactionsService) { }

  ngOnInit() {
    this.usersService.userSelected
      .subscribe((user:any)=>{
        this.user = user;
        console.log('user in TransactionsComponent sub', this.user);
        this.transactionsService.getTransactionsByUserId(this.user._id)
          .subscribe((transactions:any) => {
            console.log(transactions);
            this.transactions = transactions.data
            this.loaded = true;
          })
      })
    this.route.parent.params
      .subscribe(
        (params: Params) => {
          // console.log(params)
          
          this.usersService.getUserFromDb(params['userId'])
            .subscribe((user:any) => {
              // console.log(user.data)
              this.user = user.data;
             
              console.log('user in TransactionsComponent from server', this.user);
              this.transactionsService.getTransactionsByUserId(this.user._id)
                .subscribe((transactions:any) => {
                  console.log(transactions);
                  this.transactions = transactions.data
                  this.loaded = true;
                })

            })
        }
      );
  }

}
