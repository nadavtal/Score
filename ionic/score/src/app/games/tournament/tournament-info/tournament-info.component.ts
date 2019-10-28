import { Component, OnInit, ViewChild, AfterViewInit , OnChanges, SimpleChanges, AfterContentInit } from '@angular/core';
import { UsersService } from 'src/app/users/users.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TournamentsService } from '../../tournaments.service';
import { NgForm, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Utils } from 'src/app/shared/services/utils.service';
import { localStorageService } from 'src/app/shared/services/local-storage.service';
import { TransactionsService } from 'src/app/transactions/transaction.service';
import { SubSink } from 'subsink/dist/subsink';
import { MessagesService } from 'src/app/messages/messages.service';
import { reject } from 'q';

// import { CustomValidators } from 'src/app/shared/services/validators.service';


@Component({
  selector: 'app-tournament-info',
  templateUrl: './tournament-info.component.html',
  styleUrls: ['./tournament-info.component.scss']
})
export class TournamentInfoComponent implements OnInit {
  id: string;
  tournament: any;
  actions: any;
  loaded = false;
  editMode = false;
  registered: boolean;
  currentUser: any;
  tournamentFormSub; any;
  private subs = new SubSink();

  @ViewChild('tournamentSwal', {static: false}) private tournamentSwal: SwalComponent;
  @ViewChild('tournamentForm', {static: false}) tournamentForm: NgForm;
  // @ViewChild('saveSwal', {static: false}) private saveSwal: SwalComponent;
  constructor(
              private utilsService: Utils,
              private tournamentsService: TournamentsService,
              private route: ActivatedRoute,
              private messagesService: MessagesService,
              private usersService: UsersService,
              private router: Router,
              private localStorage: localStorageService) { }


  ngOnInit() {

    this.subs.sink = this.route.parent.params
      .subscribe(
        (params: Params) => {
          console.log(params);
          console.log(this.route);
          this.id = params.tournamentId;
          console.log(this.id)
          this.subs.sink = this.tournamentsService.getTournament(this.id)
            .subscribe((tournament: any) => {
              this.tournament = tournament.data;
              this.registered = this.utilsService.checkIfUserInArrayByUsername(this.tournament.registered, this.currentUser.userName);
              this.loaded = true;
            });
        }
      );
    this.currentUser = this.localStorage.get('currentUser');
    console.log(this.currentUser);
    this.actions = [
      {name: 'Cashier', color: 'green', icon: 'dollar'},
      {name: 'Store', color: 'green', icon: 'shopping-cart'},

      ];



    //
    // setTimeout(()=> {
    //   this.tournamentForm.form.valueChanges.subscribe((value)=>{
    //       console.log('value in valueChange', value)
    //   })
    //   this.tournamentForm.form.statusChanges.subscribe((value)=>{
    //     console.log('value in statusChanges', value)
    //   })
    // }, 500)





  }



  // ngOnChanges(changes: SimpleChanges) {
  //   console.log(changes)
  //   for (let propName in changes) {
  //     let chng = changes[propName];
  //     let cur  = JSON.stringify(chng.currentValue);
  //     let prev = JSON.stringify(chng.previousValue);
  //     console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
  //   }
  // }

  editTournament() {
    this.editMode = !this.editMode;

  }
  saveTournament(msg: any, text: any) {

    this.tournamentsService.editTournament(this.tournament)
      .subscribe((upadtedTournament: any) => {
        this.tournament = upadtedTournament.data;
        this.tournamentsService.tournamentSelected.next(this.tournament);
        // console.log(this.tournament);
        this.registered = this.utilsService.checkIfUserInArrayByUsername(this.tournament.registered, this.currentUser.userName);
        // console.log(this.registered)
        if (this.editMode == true) {
          this.editMode = !this.editMode;
        }
        console.log(msg, text);

        this.tournamentSwal.title = msg ? msg : 'Tournament saved';
        this.tournamentSwal.text = text ? text : '';
        // this.tournamentSwal.text="You are registered to this game";
        this.tournamentSwal.type = 'success';
        this.tournamentSwal.timer = 1500;
        this.tournamentSwal.fire();


      });
  }

  calculatePrize(percentage, index) {
    this.tournament.winners[index].prize = this.tournament.prizePool * percentage / 100;
  }

  calculatePrizePool(buyIn: number = this.tournament.buyIn) {

    const prizePool = buyIn * this.tournament.registered.length;
    // console.log(prizePool)
    this.tournament.prizePool = prizePool;
    // console.log(this.tournament.prizePool)
  }




  joinTournament() {
    console.log(this.currentUser);
    this.tournamentsService.tournamentRegistration('Tournament Registration', this.tournament, this.currentUser)
      .then((data: any) => {
        console.log(data);
        if (data === 'Insufficient funds') {
          this.tournamentSwal.title = 'Insufficient funds';
          this.tournamentSwal.text = 'Please add funds to your account';
            // this.tournamentSwal.text="You are registered to this game";
          this.tournamentSwal.type = 'error';
            // this.tournamentSwal.timer = 1000;
          this.tournamentSwal.fire();
        } else {
          this.subs.sink = this.messagesService.createNotificationMessage(
            this.currentUser.userName + ' registered to tournament: ' + this.tournament.name,
            '',
            this.tournament.manager,
            {tournamentId: this.tournament._id}
            )
            .subscribe((createdMessage: any) => {
                console.log('createdNotificationMessage', createdMessage);
            },
            error => {
                reject(error);
            });

          this.subs.sink = this.messagesService.createLogMessage(
            'Registered to tournament: ' + this.tournament.name + '. Your account was refunded ' + this.tournament.buyIn,
            '',
            this.currentUser,
            {tournamentId: this.tournament._id}
            )
            .subscribe((createdMessage: any) => {
                console.log('createdNotificationMessage', createdMessage);
            },
            error => {
                reject(error);
            });
          this.tournamentSwal.title = 'Registered!';
          this.tournamentSwal.text = 'Your account was charged: ' + data.buyIn + ' GOOD LUCK!';
          this.tournamentSwal.type = 'success';
          this.tournamentSwal.timer = 2000;
          this.tournamentSwal.fire();
          this.tournament = data;
        }
      });



  }


  leaveTournament() {

    this.tournamentsService.tournamentRegistration('Tournament UnRegistration', this.tournament, this.currentUser)
      .then((data: any) => {
        if (data) {
        this.subs.sink = this.messagesService.createNotificationMessage(
          this.currentUser.userName + ' unregistered to tournament: ' + this.tournament.name,
          '',
          this.tournament.manager,
          {tournamentId: this.tournament._id}
          )
          .subscribe((createdMessage: any) => {
              console.log('createdNotificationMessage', createdMessage);
          },
          error => {
              reject(error);
          });

        this.subs.sink = this.messagesService.createLogMessage(
          'Unregistered from tournament: ' + this.tournament.name + '. Your account was refunded ' + this.tournament.buyIn,
          '',
          this.currentUser,
          {tournamentId: this.tournament._id}
          )
          .subscribe((createdMessage: any) => {
              console.log('createdNotificationMessage', createdMessage);
          },
          error => {
              reject(error);
          });

        this.tournamentSwal.title = 'Pussy!';
        this.tournamentSwal.text = 'Just kidding...see you soon';
        this.tournamentSwal.type = 'success';
        this.tournamentSwal.timer = 1500;
        this.tournamentSwal.fire();
        this.tournament = data;
        }
      });

  }

  goToMyProfile() {
    this.router.navigateByUrl('/users/' + this.currentUser._id);

  }


  initializeWinners(numWinners) {
    this.tournament.winners = [];
    console.log(numWinners);
    for (let i = 0; i < numWinners; i++) {
      this.tournament.winners[i] = {position: i + 1,
                                  percentage: 0,
                                  prize: 0,
                                  userName: '',
                                  userId: ''};
    }


  }

  onSubmit() {
    this.tournamentForm.form.valueChanges.subscribe((value) => {
        console.log('value in valueChange', value);
      });
    this.tournamentForm.form.statusChanges.subscribe((value) => {
        console.log('value in statusChanges', value);
      });
    console.log(this.tournament);
    console.log(this.tournamentForm.value);

    this.tournamentsService.editTournament(this.tournament)
      .subscribe((updatedTournament: any) => {
        console.log(updatedTournament);
      });
  }

  flippingButtonClicked(event) {
    console.log(event);
    this.onSubmit();
  }





}
