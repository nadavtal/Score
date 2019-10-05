import { Component, OnInit, Input} from '@angular/core';
// import { Tournament } from '../tournament.model';
import { TournamentsService } from '../tournaments.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { localStorageService } from 'src/app/shared/services/local-storage.service';
import { Utils } from 'src/app/shared/services/utils.service';
@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit {
  id: string;
  tournament:any;
  registered:boolean;
  currentUser:any;  
  loaded:boolean =false;
  path:string;
  tab:string
  
  constructor(private tournamentsService: TournamentsService,
              private route: ActivatedRoute,
              private router: Router, 
              private localStorage: localStorageService, 
              private utilsService: Utils) { }

  ngOnInit() {
    this.tab = 'Info';
    this.currentUser = this.localStorage.get('currentUser');
    this.route.params
      .subscribe(
        (params: Params) => {
          // console.log(params);
          this.path = this.route.snapshot.url[0].path;
          
          
          this.id = params['tournamentId'];
          // console.log(this.tab)
          this.tournamentsService.getTournament(this.id)
            .subscribe((tournament:any) => {
              this.tournament = tournament.data;
              
              this.loaded = true;
              // console.log('tournament in TournamentComponent from server', this.tournament);
              this.registered = this.utilsService.checkIfUserInArrayByUsername(this.tournament.registered, this.currentUser.userName);
              this.tournamentsService.tournamentSelected.next(this.tournament)
            })
        }
      );

    
  }

  changeActiveTab(event){
    // console.log(event);
    this.tab = event;
    
  }

  

}
