import { NgModule } from '@angular/core';
import { GamesComponent } from '../games/games.component';
import { GameListComponent } from '../games/game-list/game-list.component';
import { TournamentListComponent } from '../games/tournament-list/tournament-list.component';
import { TournamentItemComponent } from './tournament-list/tournament-item/tournament-item.component';
import { GameItemComponent } from './game-list/game-item/game-item.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations:[
        GamesComponent,
        GameListComponent,
        TournamentListComponent,
        TournamentItemComponent,
        GameItemComponent,
    ],
    imports: [
        SharedModule,
        RouterModule
    ],
    exports:[
        GamesComponent,
        GameListComponent,
        TournamentListComponent,
        TournamentItemComponent,
        GameItemComponent,
    ]
})
export class GamesModule {}