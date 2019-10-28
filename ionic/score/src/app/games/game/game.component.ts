import { Component, OnInit, Input} from '@angular/core';
import { Game } from '../game.model';
import { GamesService } from '../games.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @Input() game: Game;
  constructor(private gamesService: GamesService) { }

  ngOnInit() {
    console.log(this.game)
  }

  onSelected(){
    this.gamesService.gameSelected.emit(this.game)
  }

}
