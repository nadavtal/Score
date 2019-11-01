import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../../users.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../../user.model';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { localStorageService } from 'src/app/shared/services/local-storage.service';
import { TransactionsService } from 'src/app/transactions/transaction.service';
import { SubSink } from 'node_modules/subsink/dist/subsink';
import { IonToastService } from 'src/app/shared/services/ion-toast.service';
import { moveInLeft, moveInUp } from 'src/app/shared/animations';
import { MessagesService } from 'src/app/messages/messages.service';




@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  animations: [moveInLeft, moveInUp]
})
export class InfoComponent implements OnInit, OnDestroy {
  roles = [];
  id: string;
  user: User;
  loaded = false;
  editMode = false;
  currentUser: any;
  actions: any;
  isUser: boolean;
  showTransactions = false;

  @ViewChild('deleteSwal', {static: false}) private deleteSwal: SwalComponent;
  @ViewChild('userForm', {static: false}) private userForm: NgForm;

  private subs = new SubSink();
  constructor(
            private usersService: UsersService,
            private transactionsService: TransactionsService,
            private localStorage: localStorageService,
            private messagesService: MessagesService,
            private route: ActivatedRoute,
            private toastService: IonToastService,

  ) { }

  ngOnInit() {
    this.currentUser = this.localStorage.get('currentUser');
    this.actions = [
      {name: 'Show/Hide transactions', color: 'green', icon: 'money'},
      // {name: 'Show transactions', color: 'green', icon: 'dollar'},
    ];
    // this.subs.sink = this.usersService.userSelected
    //   .subscribe((user: any) => {
    //     this.user = user;
    //     console.log('user in InfoComponent sub', this.user);
    //     this.loaded = true;
    //   });
    this.subs.sink = this.route.parent.params
        .subscribe(
          (params: Params) => {
            console.log(params);
            this.id = params.userId;
            this.subs.sink = this.usersService.getUserFromDb(this.id)
              .subscribe((user: any) => {
                // console.log(user.data)
                this.user = user.data;
                this.loaded = true;
                this.isUser = this.usersService.checkIfUserIsCurrentUser(this.user._id);
                console.log(this.isUser);
                console.log('user in InfoComponent from server', this.user);
            });
          }
        );
    this.roles =  ['User', 'Admin'];


  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  iconActionClicked(event) {
    console.log(event);
    if (event === 'Show/Hide transactions') {
      this.toggleTransactions();
    }
  }

  toggleTransactions() {
    this.showTransactions = !this.showTransactions;
    console.log(this.showTransactions);
  }

  sendMessageToUser(text) {
    this.messagesService.sendMessageToUser(this.user, this.currentUser, text, '')
      .subscribe(returnMessage => {
        if (returnMessage) {
            this.toastService.ionToastSubject.next({
            message: 'Message sent to ' + this.user.userName
          });
        }
      });
  }

  onSubmit(form: NgForm) {
    console.log(this.user);
    // console.log(form.value);


  }

  deleteFile(something) {
    console.log(something);
  }

  save() {
    console.log('saving');
  }
  remove() {
    console.log('removing');
  }

  editProfile() {
    this.editMode = !this.editMode;
  }
  saveProfile(toastMsg = 'Profile saved') {
    this.editMode = !this.editMode;
    console.log(this);
    this.subs.sink = this.usersService.updateUser(this.user)
      .subscribe((updatedUser: any) => {
        this.user = updatedUser.data;
        this.usersService.userSelected.next(this.user);
        this.localStorage.update('currentUser', this.user);
        console.log(this.localStorage.get('currentUser'));
        this.toastService.ionToastSubject.next({
          message: toastMsg,
          
        });
      },
      error => {
        console.log(error);
        this.toastService.ionToastSubject.next({
          message: error.message,
          
        });
      });
  }

  createTransaction(transaction) {
    transaction.userId = this.currentUser._id;

    console.log(transaction);
    this.subs.sink = this.transactionsService.createTransaction(transaction)
      .subscribe((createdTransaction: any) => {

        this.updateUserBalance(createdTransaction.data);
        this.saveProfile('Your balance has been updated');

      });
  }

  updateUserBalance(transaction) {
    if (transaction.transactionType === 'Deposit') {
      this.user.balance += transaction.amount;
    } else if (transaction.transactionType === 'Withdraw') {
      this.user.balance -= transaction.amount;
    }
  }



}
