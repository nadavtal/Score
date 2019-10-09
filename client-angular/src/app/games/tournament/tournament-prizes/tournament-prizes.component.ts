import { Component, OnInit } from '@angular/core';
import { TournamentsService } from '../../tournaments.service';
import { listAnimation, moveInUp, moveOutRight, moveInLeft} from '../../../shared/animations'
import { localStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-tournament-prizes',
  templateUrl: './tournament-prizes.component.html',
  styleUrls: ['./tournament-prizes.component.scss'],
  animations:[listAnimation, moveOutRight, moveInUp]
})
export class TournamentPrizesComponent implements OnInit {
  tournament:any;
  loaded:boolean = false;
  currentUser:any
  constructor( private tournamentsService: TournamentsService,
               private localStorage: localStorageService) { }

  ngOnInit() {
    this.currentUser = this.localStorage.get('currentUser');
    this.tournamentsService.tournamentSelected
      .subscribe((tournament:any) => {
        this.tournament = tournament;
        this.loaded = true
        console.log('tournament received from Subject:', this.tournament)
      })
  }

}
