import { Component, OnInit, Input, OnDestroy} from '@angular/core';
// import { Tournament } from '../tournament.model';
import { TournamentsService } from '../tournaments.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { localStorageService } from 'src/app/shared/services/local-storage.service';
import { Utils } from 'src/app/shared/services/utils.service';
import { SubSink } from 'node_modules/subsink/dist/subsink';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit, OnDestroy {
  id: string;
  tournament: any;
  registered: boolean;
  currentUser: any;
  loaded = false;
  path: string;
  tab: string;
  private subs = new SubSink();

  constructor(private tournamentsService: TournamentsService,
              private route: ActivatedRoute,
              private router: Router,
              private localStorage: localStorageService,
              private utilsService: Utils) { }

  ngOnInit() {
    this.tab = 'Info';
    this.currentUser = this.localStorage.get('currentUser');
    this.subs.sink = this.route.params
      .subscribe(
        (params: Params) => {
          // console.log(params);
          console.log(this.route);
          // this.path = this.route.snapshot.url[0].path;
          this.id = params.tournamentId;
          this.subs.sink = this.tournamentsService.getTournament(this.id)
            .subscribe((tournament: any) => {
              this.tournament = tournament.data;

              this.registered = this.utilsService.checkIfUserInArrayByUsername(this.tournament.registered, this.currentUser.userName);
              // console.log('tournament in TournamentComponent from server', this.tournament);
              // this.tournamentsService.tournamentSelected.next(this.tournament);
              this.loaded = true;
            });
        }
      );


  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  changeActiveTab(event) {
    // console.log(event);
    this.tab = event;

  }



}
