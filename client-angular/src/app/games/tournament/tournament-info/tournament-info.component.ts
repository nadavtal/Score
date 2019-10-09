import { Component, OnInit, ViewChild, AfterViewInit , OnChanges, SimpleChanges, AfterContentInit } from '@angular/core';
import { UsersService } from 'src/app/users/users.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TournamentsService } from '../../tournaments.service';
import { NgForm, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Utils } from 'src/app/shared/services/utils.service';
import { localStorageService } from 'src/app/shared/services/local-storage.service';

// import { CustomValidators } from 'src/app/shared/services/validators.service';


@Component({
  selector: 'app-tournament-info',
  templateUrl: './tournament-info.component.html',
  styleUrls: ['./tournament-info.component.scss']
})
export class TournamentInfoComponent implements OnInit{
  id: string;
  tournament:any;
  actions:any;
  loaded:boolean =false;
  editMode:boolean= false;
  registered:boolean;
  currentUser:any;
  tournamentFormSub;any;
  @ViewChild('tournamentSwal', {static: false}) private tournamentSwal: SwalComponent;
   
  
  @ViewChild('tournamentForm', {static: false}) tournamentForm: NgForm;
  // @ViewChild('saveSwal', {static: false}) private saveSwal: SwalComponent;
  constructor(
              private utilsService: Utils,
              private tournamentsService: TournamentsService,
              private route: ActivatedRoute,
              private router: Router, 
              private localStorage: localStorageService) { }

  
  ngOnInit() {
    
    this.tournamentsService.tournamentSelected
      .subscribe((tournament:any) => {
        this.tournament = tournament;
        // console.log('tournament received from Subject:', this.tournament);
        this.registered = this.utilsService.checkIfUserInArrayByUsername(this.tournament.registered, this.currentUser.userName);
        // console.log(this.registered)
        this.loaded = true
      })
    
    this.currentUser = this.localStorage.get('currentUser');
    this.actions= [
      {name: 'Log out', color: 'green', icon: 'home'},
      
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
    
    


    
  };

  

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log(changes)
  //   for (let propName in changes) {
  //     let chng = changes[propName];
  //     let cur  = JSON.stringify(chng.currentValue);
  //     let prev = JSON.stringify(chng.previousValue);
  //     console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
  //   }
  // }

  editTournament(){
    this.editMode = !this.editMode;
    ;
  }
  saveTournament(msg:any, text:any){
    
    this.tournamentsService.editTournament(this.tournament)
      .subscribe((upadtedTournament:any)=> {
        this.tournament = upadtedTournament.data;
        // console.log(this.tournament);
        this.registered = this.utilsService.checkIfUserInArrayByUsername(this.tournament.registered, this.currentUser.userName);
        // console.log(this.registered)
        if (this.editMode == true){
          this.editMode = !this.editMode;
        }

        
        this.tournamentSwal.title = msg? msg : 'Tournament saved'
        this.tournamentSwal.title="Tournament saved";
        // this.tournamentSwal.text="You are registered to this game";
        this.tournamentSwal.type="success";
        this.tournamentSwal.timer = 1000;
        this.tournamentSwal.fire()
        

      })
  }
 
  calculatePrize(percentage, index){
    this.tournament.winners[index].prize = this.tournament.prizePool * percentage / 100
  }

  calculatePrizePool(buyIn:number = this.tournament.buyIn){
    
    var prizePool = buyIn * this.tournament.registered.length;
    // console.log(prizePool)
    this.tournament.prizePool = prizePool;
    // console.log(this.tournament.prizePool)
  }
 

  joinTournament(){
    console.log('joining tournament')
    this.tournament.registered.push({userName: this.currentUser.userName,
                                    userId: this.currentUser._id});
    this.calculatePrizePool();
    this.saveTournament('Congradulations!', 'You are registered to this tournament...GOOD LUCK!')
  }
  leaveTournament(){
    console.log('leaving tournament')
    this.tournament.registered = this.utilsService.removeUserFromArrayByUserId(this.tournament.registered, this.currentUser._id);
    
    this.calculatePrizePool();
    this.saveTournament('Pussy!', 'Just kidding...see you soon!')
    // this.registered = !this.registered;
  }

  goToMyProfile(){
    this.router.navigateByUrl('/users/'+this.currentUser._id);

  }


  initializeWinners(numWinners){
    this.tournament.winners = [];
    console.log(numWinners);
    for(var i=0; i<numWinners;i++){
      this.tournament.winners[i] = {position: i+1,
                                  percentage: 0,
                                  prize: 0,
                                  userName: '',
                                  userId: ''};
    }

    
  }

  onSubmit(){
    this.tournamentForm.form.valueChanges.subscribe((value)=>{
        console.log('value in valueChange', value)  
      })
      this.tournamentForm.form.statusChanges.subscribe((value)=>{
        console.log('value in statusChanges', value)
      })
    console.log(this.tournament);
    console.log(this.tournamentForm.value);

    this.tournamentsService.editTournament(this.tournament)
      .subscribe((updatedTournament:any) =>{
        console.log(updatedTournament)
      })
  }

  flippingButtonClicked(event){
    console.log(event);
    this.onSubmit()
  }

  

  

}
