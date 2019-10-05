import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { TournamentsService } from '../../tournaments.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tournament-info',
  templateUrl: './tournament-info.component.html',
  styleUrls: ['./tournament-info.component.scss']
})
export class tournamentReactiveForm implements OnInit {
  id: string;
  tournament:any;
  tournamentForm: FormGroup;
  forbiddenUserNames = ['nad', 'gad']

  constructor(
              
              private tournamentService: TournamentsService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.tournamentForm = new FormGroup({
      'name': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)], this.forbiddenEmails),
      'manager': new FormControl(null, Validators.required),
      'privacy': new FormControl('public'),
      'platform': new FormControl(null),
      'maxPlayers': new FormControl(null),
      'playerPerBattle': new FormControl(null),
      'buyIn': new FormControl(null),
      'placesPaid': new FormControl(null),
      'time': new FormControl(null),
      'placesPaidFormArray': new FormArray([])
    })

    
    console.log('form on init', this.tournamentForm);
    this.tournamentForm.valueChanges.subscribe((value)=>{
      console.log('value in valueChange', value)  
    })
    this.tournamentForm.statusChanges.subscribe((value)=>{
      console.log('value in statusChanges', value)
    })


    this.route.parent.params
        .subscribe(
          (params: Params) => {
            // console.log(params)
            this.id = params['tournamentId'];
            this.tournamentService.getTournament(this.id)
              .subscribe((tournament:any) => {
                // console.log(tournament.data)
                this.tournament = tournament.data
                console.log('tournament in TournamentInfoComponent from server', this.tournament);
                // this.tournamentForm.setValue({
                //   'name': this.tournament.name,
                //   'manager': this.tournament.manager,
                //   'privacy': this.tournament.privacy,
                //   'platform': this.tournament.platform,
                //   'maxPlayers': this.tournament.maxPlayers,
                //   'playerPerBattle': this.tournament.playerPerBattle,
                //   'buyIn': this.tournament.buyIn,
                //   'placesPaid': this.tournament.placesPaid,
                //   'time': this.tournament.time,
                //   'placesPaidFormArray': []
                // });
                console.log(this.tournamentForm)
              })
          }
        );
  }

  onPlacesPaid(placesPaid:number){
    console.log(placesPaid);
    
    for(var i = 0; i<placesPaid; i++){
      const positionControl = new FormControl(null, Validators.required);
      (<FormArray>this.tournamentForm.get('placesPaidFormArray')).push(positionControl)
    }
    
  }

  onSubmit(){
    console.log(this.tournamentForm)
  }

  forbiddenNames(control: FormControl): {[s: string]: boolean}{
    if(this.forbiddenUserNames.indexOf(control.value) !== -1){
      return { 'forbidden' : true}
    }
    return null
    //if validation is successful you have to reuturn nothing or null
  }

  forbiddenEmails(control: FormControl) : Promise<any> | Observable<any>{
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if(control.value === 'test'){
          resolve({'forbidden' : true})
        } else{
          resolve(null)
        }
      }, 1000)
    })
    return promise
  }

}
