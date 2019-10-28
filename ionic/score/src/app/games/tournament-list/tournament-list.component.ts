import { Component, OnInit, ViewChild, OnDestroy, } from '@angular/core';
// import { Tournament } from '../tournament.model';
import { TournamentsService } from '../tournaments.service';
import { UsersService } from 'src/app/users/users.service';
import { User } from 'src/app/users/user.model';
import { ActivatedRoute, Params } from '@angular/router';
import { GroupsService } from 'src/app/groups/groups.service';
import { Utils } from 'src/app/shared/services/utils.service';
import { localStorageService } from 'src/app/shared/services/local-storage.service';
import { SubSink } from '../../../../node_modules/subsink/dist/subsink';
import { listAnimation, moveInUp, moveInLeft } from '../../shared/animations';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-tournament-list',
  templateUrl: './tournament-list.component.html',
  styleUrls: ['./tournament-list.component.scss'],
  animations: [
    listAnimation, moveInUp, moveInLeft
  ]
})
export class TournamentListComponent implements OnInit, OnDestroy {
  user: User;
  currentUser: any;
  isLoggedIn: boolean;
  group: any;
  tournaments: any[];
  managedTournaments: any;
  id: string;
  actions: any;
  loaded = false;
  today: Date = new Date(Date.now());
  showTournaments = 'Registered tournaments';
  showSwitchButton = true;
  topPositionHeaderClass: string;
  topPositionContentClass: string;
  showFilterSection = false;
  @ViewChild('tournamentSwal', {static: false}) private tournamentSwal: SwalComponent;
  private subs = new SubSink();
  // @ViewChild('filterSection', {static: false}) filterSection:any;
  

  constructor(private tournamentsService: TournamentsService,
              private usersService: UsersService,
              private groupService: GroupsService,
              private loaclStorage: localStorageService,
              private utilsService: Utils,
              private route: ActivatedRoute
  ) { }

  ngOnInit() {
    if (this.loaclStorage.get('currentUser')){
      this.currentUser = this.loaclStorage.get('currentUser');

    }
    if (this.currentUser){
      this.isLoggedIn = true;
    }
   
    this.actions = [
      {name: 'Filter', color: 'green', icon: 'filter', },
        ];

    // this.usersService.userSelected
    //   .subscribe((user:any)=>{
    //     this.user = user;
    //     // console.log('user in tournamentsService sub', this.user);
        
    //     this.tournamentsService.getTournamentsByUserID(this.user._id)
    //         .subscribe((tournaments:any) => {
    //           this.tournaments = tournaments.data;
    //           this.addRegisteredToTournaments(this.user, this.tournaments);
    //           this.loaded = true;
    //           console.log(this.tournaments)
    //         });
          
    //     this.tournamentsService.getTournamentsManagedByUserName(this.user.userName,  {time: this.today})
    //       .subscribe((managedTournaments:any)=>{
    //         this.managedTournaments = managedTournaments.data;
    //         this.addRegisteredToTournaments(this.user, this.managedTournaments);
    //         this.loaded = true;
    //         console.log(this.managedTournaments)
    //     })
    //   })
    this.subs.sink = this.route.parent.params
        .subscribe(
          (params: Params) => {
            
            if (params['userId']){
              this.id = params['userId'];
              this.topPositionHeaderClass = 'pageHeaderTabs';
              this.topPositionContentClass = 'pageContentTabs';
              this.subs.sink = this.usersService.getUserFromDb(this.id)
                .subscribe((user: any) => {
                  // console.log(user.data)
                  this.user = user.data;
                  
                  this.subs.sink = this.tournamentsService.getTournamentsByUserID(this.user._id)
                    .subscribe((tournaments: any) => {
                      this.tournaments = tournaments.data;
                      this.addRegisteredToTournaments(this.user, this.tournaments);
                      this.loaded = true;
                      
                    });
                    this.subs.sink = this.tournamentsService.getTournamentsManagedByUserName(this.user.userName,  {time: this.today})
                    .subscribe((managedTournaments: any) => {
                      this.managedTournaments = managedTournaments.data;
                      this.addRegisteredToTournaments(this.user, this.managedTournaments);
                      this.loaded = true;
                    });
                });
            } 
            else if (params['groupId']){
              this.id = params['groupId'];
              this.topPositionHeaderClass = 'pageHeaderTabs';
              this.topPositionContentClass = 'pageContentTabs';
              this.subs.sink = this.groupService.getGroupFromDb(this.id)
                .subscribe((group: any) => {
                  // this.userLoaded = true;
                  this.group = group.data;
                  
                  
                  this.subs.sink = this.tournamentsService.getTournamentsByGroupID(this.id)
                  .subscribe((tournaments: any) => {
                    this.tournaments = tournaments.data;
                    console.log(this.tournaments);
                    this.addRegisteredToTournaments(this.currentUser, this.tournaments);
                    this.loaded = true;
                  });
                });
              
            }

            else{
              this.topPositionHeaderClass = 'pageHeader';
              this.topPositionContentClass = 'pageContent';
              this.showSwitchButton = false;
              this.subs.sink = this.tournamentsService.getAllTournaments()
                  .subscribe((tournaments: any) => {
                    this.tournaments = tournaments.data;
                    if (this.isLoggedIn){
                      this.addRegisteredToTournaments(this.currentUser, this.tournaments);

                    }
                    console.log(this.tournaments);
                    this.loaded = true;
                  });
            }
            
            
          }
        );
    
    
  }
  
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  onActionClick(event){
    console.log(event);
    if (event == 'Filter'){
      this.toggleFilterSection();
    }
  }

  toggleFilterSection(){// console.log(this.filterSection);

    this.showFilterSection = !this.showFilterSection;
  }

  addRegisteredToTournaments(user, tournaments){
    // for(let i=0; i<tournaments.length;i++){
    //   tournaments[i].isRegistered = this.utilsService.checkIfUserInArrayByUsername(tournaments[i].registered, user.userName) 
    // }
  }

  showOnlyManagedTournaments(){
    this.showTournaments = 'Managed tournaments';
  }
  showOnlyRegisteredTournaments(){
    this.showTournaments = 'Registered tournaments';
  }

  

              

              
  

}
