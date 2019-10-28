import { NgModule } from '@angular/core';

import { GameInfoComponent } from './game-info/game-info.component';
import { GameStructureComponent } from './game-structure/game-structure.component';
import { GameComponent } from './game.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations:[
        GameComponent,
        GameInfoComponent,
        GameStructureComponent
    ],
    imports:[
        SharedModule
    ],
    exports:[
        GameComponent,
        GameInfoComponent,
        GameStructureComponent
    ]

})
export class GameModule {}