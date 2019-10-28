import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MessagesComponent } from './messages.component';
import { MessageComponent } from './message/message.component';
import { MessagesListComponent } from './messages-list/messages-list.component';

@NgModule({
    declarations:[
        MessagesComponent,
        MessageComponent,
        MessagesListComponent,
    ],
    imports: [
        SharedModule,
        RouterModule,
    ],
    exports:[
        MessagesComponent,
        MessageComponent,
        MessagesListComponent,
    ]
})
export class MessagesModule{

}