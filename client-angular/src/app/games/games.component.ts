import { Component, OnInit } from '@angular/core';
import { Game } from './game.model';
import { GamesService } from './games.service';
import { QueryService } from '../shared/services/query.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  selectedGame: Game;
  constructor(private gamesService: GamesService,
              private httpService: QueryService) { }

  ngOnInit() {
    // this.gamesService.gameSelected
    //   .subscribe((game: Game) =>{
    //     this.selectedGame = game
    //   });
    
    

    // this.httpService.get('clashusers/%232JYGLLPU')
    //   .subscribe(responseData => {
    //     console.log(responseData);
    // }, error=>{
    //   this.httpService.error.next(error.message);
    //   console.log(error)
    // });
    

  }

}
