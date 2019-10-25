import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SwitchCheckBoxComponent } from '../shared/components/switch-check-box/switch-check-box.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertComponent } from '../shared/components/sweet-alert/sweet-alert.component';
import { IconActionsComponent } from '../shared/components/icon-actions/icon-actions.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from '../shared/components/chat/chat.component';
import { IconToRowComponent } from '../shared/components/icon-to-row/icon-to-row.component';
import { dinamicTabsComponent } from '../dinamic-tabs/dinamic-tabs.component';
import { ToolBarComponent } from '../shared/components/tool-bar/tool-bar.component';
import { ThreeDButtonComponent } from '../shared/components/three-d-button/three-d-button.component';
import { FriendComponent } from '../friends/friend/friend.component';
import { ButtonToModalComponent } from '../shared/components/button-to-modal/button-to-modal.component';
import { ShareButtonComponent } from '../shared/components/share-button/share-button.component';
import { ToFullScreenComponent } from '../shared/components/to-full-screen/to-full-screen.component';
import { PageHeaderComponent } from '../shared/components/page-header/page-header.component';
import { FlippingButtonComponent } from '../shared/components/flipping-button/flipping-button.component';
import { NameValidator } from '../shared/directives/name-validator.directive';
import { UserRowComponent } from '../shared/components/user-row/user-row.component';
import { SendMessageComponent } from '../shared/components/send-message/send-message.component';
import { StatsComponent } from './components/stats/stats.component';
import { GlowingSpinnerComponent } from './components/glowing-spinner/glowing-spinner.component';
import { ClashRoyaleBattleComponent } from '../accounts/account/clash-royale-user-account/clash-royale-battles/clash-royale-battle/clash-royale-battle.component';
import { ArraySortPipe } from './pipes/sort.pipe';
import { UnreadMessages } from './pipes/unread-messages.pipe';
import { ProgressLoaderComponent } from './components/progress-loader/progress-loader.component';
import { InfiniteScrollComponent } from './components/infinite-scroll/infinite-scroll.component'
//PAGINATION COMPONENETS
import { JwPaginationComponent } from 'jw-angular-pagination';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TransactionsComponent } from '../transactions/transactions.component';
import { TransactionItemComponent } from '../transactions/transaction-item/transaction-item.component';


@NgModule({
    declarations: [
        SwitchCheckBoxComponent,
        SweetAlertComponent,
        IconActionsComponent,
        dinamicTabsComponent,
        IconToRowComponent,
        ToolBarComponent,
        ChatComponent,
        ThreeDButtonComponent,
        FriendComponent,
        ButtonToModalComponent,
        ShareButtonComponent,
        ToFullScreenComponent,
        PageHeaderComponent,
        FlippingButtonComponent,
        NameValidator,
        UserRowComponent,
        SendMessageComponent,
        StatsComponent, 
        GlowingSpinnerComponent,
        ArraySortPipe,
        ProgressLoaderComponent,
        JwPaginationComponent,
        InfiniteScrollComponent,
        ClashRoyaleBattleComponent,
        TransactionsComponent,
        TransactionItemComponent,
        UnreadMessages

    ],
    imports: [
        RouterModule,
        SweetAlert2Module.forRoot(),
        CommonModule,
        MaterialModule,
        AngularFontAwesomeModule,
        FormsModule,
        InfiniteScrollModule
        
    ],
    exports: [
        SwitchCheckBoxComponent,
        SweetAlertComponent,
        IconActionsComponent,
        dinamicTabsComponent,
        IconToRowComponent,
        ToolBarComponent,
        ThreeDButtonComponent,
        FriendComponent,
        ButtonToModalComponent,
        ShareButtonComponent,
        ToFullScreenComponent,
        PageHeaderComponent,
        FlippingButtonComponent,
        NameValidator,
        UserRowComponent,
        SendMessageComponent,
        ChatComponent,
        StatsComponent, 
        GlowingSpinnerComponent,
        ArraySortPipe,
        CommonModule,
        MaterialModule,
        AngularFontAwesomeModule,
        FormsModule,
        SweetAlert2Module,
        ProgressLoaderComponent,
        JwPaginationComponent,
        InfiniteScrollModule,
        InfiniteScrollComponent,
        ClashRoyaleBattleComponent,
        TransactionsComponent,
        TransactionItemComponent,
        UnreadMessages
    ]
})
export class  SharedModule{

}