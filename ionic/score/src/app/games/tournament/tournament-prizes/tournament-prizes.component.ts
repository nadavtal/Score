import { Component, OnInit, OnDestroy } from '@angular/core';
import { TournamentsService } from '../../tournaments.service';
import { listAnimation, moveInUp, moveOutRight, moveInLeft} from '../../../shared/animations'
import { localStorageService } from 'src/app/shared/services/local-storage.service';
import { SubSink } from 'node_modules/subsink/dist/subsink'

@Component({
  selector: 'app-tournament-prizes',
  templateUrl: './tournament-prizes.component.html',
  styleUrls: ['./tournament-prizes.component.scss'],
  animations:[listAnimation, moveOutRight, moveInUp]
})
export class TournamentPrizesComponent implements OnInit, OnDestroy {
  tournament:any;
  loaded:boolean = false;
  currentUser:any;
  private subs = new SubSink();
  constructor( private tournamentsService: TournamentsService,
               private localStorage: localStorageService) { }

  ngOnInit() {
    this.currentUser = this.localStorage.get('currentUser');
    this.subs.sink = this.tournamentsService.tournamentSelected
      .subscribe((tournament:any) => {
        this.tournament = tournament;
        this.loaded = true
        console.log('tournament received from Subject:', this.tournament)
      })
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
