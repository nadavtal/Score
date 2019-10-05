import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 



import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { DropdownDirective } from './shared/dropDown.directive';
import { shoppingListService } from './shopping-list/shopping-list.service';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user/user.component';
import { GamesComponent } from './games/games.component';
import { GameListComponent } from './games/game-list/game-list.component';

import { GroupsComponent } from './groups/groups.component';
import { GroupComponent } from './groups/group/group.component';

import { UsersListComponent } from './users/users-list/users-list.component';
import { GameComponent } from './games/game/game.component';

import { appRoutingModule } from './app-routing.module';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { UserListItemComponent } from './users/users-list/user-list-item/user-list-item.component';

import { GroupItemComponent } from './groups/group-item/group-item.component';
import { GroupsService } from './groups/groups.service';
import { dinamicTabsComponent } from './dinamic-tabs/dinamic-tabs.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AccountsComponent } from './accounts/accounts.component';
import { AccountComponent } from './accounts/account/account.component';
import { FriendsComponent } from './friends/friends.component';
import { FriendComponent } from './friends/friend/friend.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageComponent } from './messages/message/message.component';
import { InfoComponent } from './users/user/info/info.component';
import { MaterialModule } from './material/material.module';
import { AccountsService } from './accounts/accountsService';
import { ButtonToModalComponent } from './shared/components/button-to-modal/button-to-modal.component';
import { ShareButtonComponent } from './shared/components/share-button/share-button.component';
import { SwitchCheckBoxComponent } from './shared/components/switch-check-box/switch-check-box.component';
import { ToFullScreenComponent } from './shared/components/to-full-screen/to-full-screen.component';
import { DinamicModalComponent, DialogOverviewExampleDialog } from './shared/components/dinamic-modal/dinamic-modal.component';
import { GameFormComponent } from './games/game-form/game-form.component';
import { AuthInterceptorService } from './auth-interceptor.service';
import { PageHeaderComponent } from './shared/components/page-header/page-header.component';
import { TournamentListComponent } from './games/tournament-list/tournament-list.component';
import { TournamentComponent } from './games/tournament/tournament.component';
import { StatsComponent } from './shared/components/stats/stats.component';
import { GroupInfoComponent } from './groups/group/group-info/group-info.component';
import { FlippingButtonComponent } from './shared/components/flipping-button/flipping-button.component';
import { TournamentItemComponent } from './games/tournament-list/tournament-item/tournament-item.component';
import { TournamentInfoComponent } from './games/tournament/tournament-info/tournament-info.component';
import { TournamentStructureComponent } from './games/tournament/tournament-structure/tournament-structure.component';
import { TournamentPrizesComponent } from './games/tournament/tournament-prizes/tournament-prizes.component';
import { NameValidator } from './shared/directives/name-validator.directive';
import { UserRowComponent } from './shared/components/user-row/user-row.component';
import { ThreeDButtonComponent } from './shared/components/three-d-button/three-d-button.component';
import { ToolBarComponent } from './shared/components/tool-bar/tool-bar.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AuthComponent } from './auth/auth.component';
import { GroupFormComponent } from './groups/group/group-form/group-form.component';
import { SweetAlertComponent } from './shared/components/sweet-alert/sweet-alert.component';
import { IconActionsComponent } from './shared/components/icon-actions/icon-actions.component';
import { GameItemComponent } from './games/game-list/game-item/game-item.component';
import { GameInfoComponent } from './games/game/game-info/game-info.component';
import { GameStructureComponent } from './games/game/game-structure/game-structure.component';
import { CalculatePrizePoolComponent } from './shared/components/calculate-prize-pool/calculate-prize-pool.component';
import { AccountItemComponent } from './accounts/account-item/account-item.component';
import { AccountFormComponent } from './accounts/account-form/account-form.component';
import { AccountInfoComponent } from './accounts/account/account-info/account-info.component';
import { AccountBattlesComponent } from './accounts/account/account-battles/account-battles.component';
import { ClashRoyaleBattleComponent } from './accounts/account/account-battles/clash-royale-battle/clash-royale-battle.component';
import { MessagesListComponent } from './messages/messages-list/messages-list.component';
import { GlowingSpinnerComponent } from './shared/components/glowing-spinner/glowing-spinner.component';
import { ChatComponent } from './shared/components/chat/chat.component';
import { SendMessageComponent } from './shared/components/send-message/send-message.component';
import { IconToRowComponent } from './shared/components/icon-to-row/icon-to-row.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    DropdownDirective,
    UsersComponent,
    UserComponent,
    GamesComponent,
    GameListComponent,
    TournamentListComponent,
    TournamentComponent,
    GroupsComponent,
    GroupComponent,
    UsersListComponent,
    GameComponent,
    RecipeEditComponent,
    UserListItemComponent,
    
    GroupItemComponent,
    dinamicTabsComponent,
    AccountsComponent,
    AccountComponent,
    FriendsComponent,
    FriendComponent,
    MessagesComponent,
    MessageComponent,
    InfoComponent,
    ButtonToModalComponent,
    ShareButtonComponent,
    SwitchCheckBoxComponent,
    ToFullScreenComponent,
    DinamicModalComponent,
    DinamicModalComponent, 
    DialogOverviewExampleDialog, 
    GameFormComponent, 
    PageHeaderComponent, 
    StatsComponent, 
    GroupInfoComponent, 
    FlippingButtonComponent, 
    TournamentItemComponent, 
    TournamentInfoComponent, 
    TournamentStructureComponent, 
    TournamentPrizesComponent, 
    NameValidator, UserRowComponent, ThreeDButtonComponent, ToolBarComponent, HomepageComponent, AuthComponent, GroupFormComponent, SweetAlertComponent, IconActionsComponent, GameItemComponent, GameInfoComponent, GameStructureComponent, CalculatePrizePoolComponent, AccountItemComponent, AccountFormComponent, AccountInfoComponent, AccountBattlesComponent, ClashRoyaleBattleComponent, MessagesListComponent, GlowingSpinnerComponent, ChatComponent, SendMessageComponent, IconToRowComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    appRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    SweetAlert2Module.forRoot(),
    AngularFontAwesomeModule,
    HttpClientModule,
    
   
    
  ],
  entryComponents: [DinamicModalComponent, DialogOverviewExampleDialog, GroupFormComponent],
  providers: [
    shoppingListService,
    DinamicModalComponent,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    
    
    GroupsService,
    AccountsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
