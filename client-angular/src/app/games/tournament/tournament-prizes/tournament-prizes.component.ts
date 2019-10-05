import { Component, OnInit } from '@angular/core';
import { TournamentsService } from '../../tournaments.service';

@Component({
  selector: 'app-tournament-prizes',
  templateUrl: './tournament-prizes.component.html',
  styleUrls: ['./tournament-prizes.component.scss']
})
export class TournamentPrizesComponent implements OnInit {
  tournament:any;
  constructor( private tournamentsService: TournamentsService,) { }

  ngOnInit() {
    this.tournamentsService.tournamentSelected
      .subscribe((tournament:any) => {
        this.tournament = tournament;
        // console.log('tournament received from Subject:', this.tournament)
      })
  }

}
