import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { AccountsService } from '../accounts/accountsService';
import { PlatformsService } from '../shared/services/platforms.service';
import { GameTypeService } from '../games/game-type.service';
import { PlatformTypeService } from '../games/platform-type.service';
import { GamesService } from '../games/games.service';
import { GroupsService } from '../groups/groups.service';
import { MessagesService } from '../messages/messages.service';
import { TournamentsService } from '../games/tournaments.service';
import { ClashRoyaleService } from '../accounts/accounts-services/clash-royale.service';
import { localStorageService } from '../shared/services/local-storage.service';
import { BattlesService } from '../shared/services/battles.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  loaded:boolean =false
  currentUser = this.localStorage.get('user');

  constructor(
    private localStorage: localStorageService,
    private usersService: UsersService,
    private accountsService: AccountsService,
    private platformService: PlatformsService,
    private gameTypeService: GameTypeService,
    private platformTypeService: PlatformTypeService,
    private gamesService: GamesService,
    private groupsService: GroupsService,
    private messagesService: MessagesService,
    private tournamentsService: TournamentsService,
    private clashRoyaleService: ClashRoyaleService,
    private battlesService: BattlesService,

    
  ) { }

  ngOnInit() {
    
      
    this.usersService.getUsers()
        .subscribe((data:any) => {
          const users = data.data;
          console.log('all users: ', users)
        })

    // this.usersService.getAllFiles()
    // .subscribe((data:any ) => {
    //   console.log(data)
    //   const files = data.data.data;
    //   console.log('all files: ', files)
    // })
          
    this.accountsService.getAccounts()
    .subscribe((accounts:any) => {
      accounts = accounts.data
      console.log('all accounts', accounts)
    })

    this.platformService.getPlatforms()
    .subscribe((platforms:any) => {
      platforms = platforms.data;
      console.log('platforms:', platforms)
      
    });

    this.gameTypeService.getAllGameTypes()
    .subscribe((gameTypes:any) => {
    gameTypes = gameTypes.data;
    console.log('gameTypes:', gameTypes)
    
    });

    this.platformTypeService.getAllPlatformTypes()
    .subscribe((platformTypes:any) => {
    platformTypes = platformTypes.data;
    console.log('platformTypes:', platformTypes)
    
    });

    this.gamesService.getGames()
    .subscribe((data:any) => {
      const games = data.data;
      console.log('all games:', games)
    });

    this.groupsService.getGroups()
      .subscribe(function(groups:any) {
        // console.log(game)
        groups = groups.data;
        console.log('allgroups', groups)
        
      })
      
    this.messagesService.getAllMessages()
      .subscribe((messages:any) => {
        console.log('all messages: ', messages.data)
      });

    this.tournamentsService.getAllTournaments()
      .subscribe((tournaments:any) => {
        console.log('all tournaments: ', tournaments.data)
      })
    this.clashRoyaleService.getAllClashUsers()
      .subscribe((clashUsers:any) => {
        console.log('all clashUsers: ', clashUsers.data)
      });
    this.clashRoyaleService.getClansFromDatabase()
      .subscribe((clashRoyaleClans:any) => {
        console.log('all clashRoyaleClans: ', clashRoyaleClans.data)
      });
    this.battlesService.getAllBattles()
      .subscribe((battles:any) =>{
        console.log('All Battles', battles.data)
      })
  }

}
