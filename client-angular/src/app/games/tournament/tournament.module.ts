import { NgModule } from '@angular/core';
import { TournamentComponent } from './tournament.component';
import { TournamentInfoComponent } from './tournament-info/tournament-info.component';
import { TournamentStructureComponent } from './tournament-structure/tournament-structure.component';
import { TournamentPrizesComponent } from './tournament-prizes/tournament-prizes.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations:[
        TournamentComponent,
        TournamentInfoComponent, 
        TournamentStructureComponent, 
        TournamentPrizesComponent, 
    ],
    imports:[
        SharedModule,
        
    ],
    exports:[
        TournamentComponent,
        TournamentInfoComponent, 
        TournamentStructureComponent, 
        TournamentPrizesComponent,
    ]
})
export class  TournamentModule {

}