import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../../users.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../../user.model';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { localStorageService } from 'src/app/shared/services/local-storage.service';
import { TransactionsService } from 'src/app/transactions/transaction.service';





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
  actions: any;
  isUser: boolean;
  showTransactions:boolean = false

  @ViewChild('deleteSwal', {static: false}) private deleteSwal: SwalComponent;
  @ViewChild('userForm', {static: false}) private userForm: NgForm;
  
  constructor(
            private usersService: UsersService,
            private transactionsService: TransactionsService,
            private localStorage: localStorageService,
            private route: ActivatedRoute,
            
            
  ) { }

  ngOnInit() {
    this.currentUser = this.localStorage.get('currentUser');
    this.actions = [
      {name: 'Show/Hide transactions', color: 'green', icon: 'money'},
      // {name: 'Show transactions', color: 'green', icon: 'dollar'},
    ]
    this.usersService.userSelected
      .subscribe((user:any)=>{
        this.user = user;
        console.log('user in InfoComponent sub', this.user);
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
                this.user = user.data;
                this.loaded = true;
                console.log('user in InfoComponent from server', this.user);
                
  
              })
          }
        );
    this.roles =  ['User', 'Admin'];
    
   
  }

  iconActionClicked(event){
    console.log(event)
    if(event == 'Show/Hide transactions'){
      this.toggleTransactions()
    }
  }

  toggleTransactions(){
    this.showTransactions = !this.showTransactions;
    console.log(this.showTransactions)
  }

  sendMessageToUser(){
    console.log('send message to: ', this.user.userName)
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

  createTransaction(transaction){
    transaction.userId = this.currentUser._id;
    
    console.log(transaction)
    this.transactionsService.createTransaction(transaction)
      .subscribe((createdTransaction:any) => {
        
        this.updateUserBalance(createdTransaction.data)
        this.usersService.updateUser(this.user)
          .subscribe((updatedUser:any) => {
            console.log(updatedUser)
            // this.user = updatedUser.data
          },
          error => {
            console.log(error)
          })
        
      })
  }

  updateUserBalance(transaction){
    if(transaction.transactionType == 'Deposit'){
      this.user.balance += transaction.amount
    }
    else if (transaction.transactionType == 'Withdraw'){
      this.user.balance -= transaction.amount
    }
  }

}
