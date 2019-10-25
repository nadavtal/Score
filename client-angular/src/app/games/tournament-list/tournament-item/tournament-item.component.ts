import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { TournamentsService } from '../../tournaments.service';
import { Utils } from 'src/app/shared/services/utils.service';
import { SwalService } from 'src/app/shared/services/swal.service';

@Component({
  selector: 'app-tournament-item',
  templateUrl: './tournament-item.component.html',
  styleUrls: ['./tournament-item.component.scss']
})
export class TournamentItemComponent implements OnInit {
  @Input() tournament:any;
  @Input() currentUser:any;
  registered:boolean
  // @ViewChild('userSwal', {static: false}) private userSwal: SwalComponent;
  constructor(
    private tournamentsService: TournamentsService,
    private swalService: SwalService,
    private utilsService: Utils
    
  ) { }

  ngOnInit() {
    if(this.currentUser){
      this.registered = this.utilsService.checkIfUserInArrayByUsername(this.tournament.registered, this.currentUser.userName);

    }
  }

  fllipingButtonClicked(event){
    console.log(event)
    if(event == 'falseFunction'){
      this.leaveTournament(this.tournament)
    } else {
      this.joinTournament(this.tournament)
    }
    
  }

  joinTournament(tournament:any){
    console.log('joining')
    if(!this.currentUser){
      console.log('NOT LOGGED IN')
      this.swalService.swal
      .next({
        title: 'Not logged in',
        text: "You must be logged in to register",
        type: "error",
        showConfirmButton: true,
        showCancelButton: true,
        swalOptions: { confirmButtonText: 'Login',
                        action: 'login/signup'}
      })
    } else{
      this.tournamentsService.tournamentRegistration('Tournament Registration', tournament, this.currentUser)
        .then((data:any)=>{
          console.log(data);
          if(data == 'Insufficient funds'){
            this.swalService.swal
              .next({
                title: 'Insufficient funds',
                text: "Please add funds to your account",
                type: "error",
                showConfirmButton: true,
                showCancelButton: true,
                swalOptions: { confirmButtonText: 'Go to cashier',
                               action: 'deposit'}
              })
          
          }
          if(data.updatedTournament){
            this.swalService.swal
              .next({
                title: 'Registered!',
                text: "Your account was charged: " + data.updatedTournament.buyIn + ' GOOD LUCK!',
                type: "success",
                timer: 2000,
                showConfirmButton: false,
                showCancelButton: false,
                swalOptions: {}
              })
           
            this.tournament = data.updatedTournament
            this.registered = this.utilsService.checkIfUserInArrayByUsername(this.tournament.registered, this.currentUser.userName);
          }
        })

    }
   
   
    
  }


  leaveTournament(tournament:any){
    console.log('leaving')
    this.tournamentsService.tournamentRegistration('Tournament UnRegistration', tournament, this.currentUser)
      .then((data:any)=>{
        
        if(data.updatedTournament){
          this.swalService.swal
            .next({
              title: 'Pussy!',
              text: "Just kidding...your account was refunded " + data.updatedTournament.buyIn + ' See you soon',
              type: "success",
              timer: 2000,
              showConfirmButton: false,
              showCancelButton: false,
              swalOptions: {}
            })
        
            this.tournament = data.updatedTournament
            this.registered = this.utilsService.checkIfUserInArrayByUsername(this.tournament.registered, this.currentUser.userName);
        }
      })
    
  }

}
