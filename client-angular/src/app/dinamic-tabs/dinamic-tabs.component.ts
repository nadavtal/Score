import { Component, OnInit, ElementRef, ViewChild, Input, Output } from '@angular/core';

import { ActivatedRoute, Params, Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { localStorageService } from '../shared/services/local-storage.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { TournamentsService } from '../games/tournaments.service';
import { Subject } from 'rxjs';
import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';


@Component({
  selector: 'app-dinamic-tabs',
  templateUrl: './dinamic-tabs.component.html',
  styleUrls: ['./dinamic-tabs.component.scss'],
  animations:[
    trigger('tabsAnimation',[
      transition('*=>*', [
        query('.cubeMenuItem', style({opacity: 0, transform: 'translateX(100vw)'})),
        query('.cubeMenuItem',stagger('150ms', [
          animate('150ms ease-out', style({opacity: 1, transform: 'translateX(0)'}))
        ]))
      ])
    ])
  ]
})
export class dinamicTabsComponent implements OnInit {
  @ViewChild('lineBreak', {static: false}) line: ElementRef;

  tabs: any;
  activeTab:string;
  widthClass:string;
  showMenuTab:Boolean = false;
  id:string;
  component: string;
  user: User;
  lineClasses:string;
  currentUser:any;
  actions:any;
  toolBarColor:string;
  
  path:any;
  tab:any;

  @Input() routeMode: any;
  @Output() tabSubject = new Subject<any>()
  
  constructor(private route: ActivatedRoute,
              private localStorage: localStorageService,
              private usersService: UsersService,
              private router: Router,
              private tournamentsService: TournamentsService
              ) {
                
               }

  ngOnInit() {
    // console.log(this.routeMode)
    this.router.events.subscribe( (event: Event) => {
    
      if (event instanceof NavigationStart) {
        //  console.log('NavigationStart', event) // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
          // Hide loading indicator
          console.log('NavigationEnd', event);
          this.tab = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
          
          console.log(this.tab)
          for(let i =0; i<this.tabs.length; i++){
            if(this.tabs[i].name == this.tab){
              this.showMenuTab = true;
              break
            } else{
              this.showMenuTab = false;
            }
          }

          console.log(this.showMenuTab)

          
      }

      if (event instanceof NavigationError) {
          // Hide loading indicator

          // Present error to user
          console.log(event.error);
      }
    });

    this.tab = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
    
    // console.log(this.activeTab, this.tab)
    
    this.currentUser = this.localStorage.get('currentUser');
    this.route.params
      .subscribe(
        (params: Params) => {
          // console.log('tab list params:', params)
         
          this.path = this.route.snapshot.url[0].path;
          // this.tab = this.route.snapshot.url[2].path;
          
          console.log(this.path, this.tab)
          
          if(this.path == 'home'){
            
            this.tabs = [
              {name: 'Tournaments', color: 'green', icon: 'person', index: 0},
              {name: 'Games', color: 'orange', icon: 'settings_cell', index: 1},
              {name: 'Leagues', color: 'pink', icon: 'group', index: 2},
              {name: 'Groups', color: 'blue', icon: 'people_outline', index: 3},
             
            ];
            
            
          }
          if(this.path == 'users'){
            this.id = params['userId'];
            this.tabs = [
              {name: 'Profile', color: 'green', icon: 'person', index: 0},
              {name: 'Accounts', color: 'orange', icon: 'settings_cell', index: 1},
              {name: 'Groups', color: 'blue', icon: 'group', index: 2},
              {name: 'Friends', color: 'purple', icon: 'people_outline', index: 3},
              {name: 'Games', color: 'black', icon: 'games', index: 4},
              {name: 'Messages', color: 'pink', icon: 'chat', index: 5},
            ];
            
            
          }
          else if(this.path == 'groups'){
            this.id = params['groupId'];
            
            this.tabs = [
              {name: 'Info', color: 'green', icon: 'person'},
              {name: 'Stats', color: 'orange', icon: 'people_outline'},
              {name: 'Games', color: 'black', icon: 'games'},
              {name: 'Messages', color: 'pink', icon: 'chat'},
            ];
          }
          else if(this.path == 'tournaments'){
            this.routeMode = false;
            this.activeTab = 'Info';
            console.log(this.activeTab)
            this.id = params['tournamentId'];
            
            this.tabs = [
              {name: 'Info', color: 'green', icon: 'person'},
              {name: 'Structure', color: 'orange', icon: 'people_outline'},
              {name: 'Prizes', color: 'black', icon: 'games'},
              
            ];
            
          }
          else if(this.path == 'accounts'){
            this.routeMode = false;
            this.id = params['accountId'];
            
            this.tabs = [
              {name: 'Info', color: 'black', icon: 'person'},
              {name: 'Battles', color: 'orange', icon: 'people_outline'},
             
              
            ];
            
          }
          this.widthClass = this.setWidthClass(this.tabs.length);
          // console.log(this.widthClass)
            
          // console.log(this.route.firstChild.routeConfig.path);
          if(this.route.firstChild){
            this.activeTab = this.route.firstChild.routeConfig.path;
            
          }
          if(this.activeTab){
            
            let color:string;
            let tabIndex:number;
            for(let i =0; i<this.tabs.length; i++){
              if(this.tabs[i].name == this.activeTab){
                color = this.tabs[i].color;
                tabIndex = i;
                break;
              }
            }
            
            // console.log(this.activeTab)
            let positionClass = this.setPositionClass(tabIndex, this.tabs.length);
            let className =positionClass +' border-'+color;
            // console.log(className)
            this.lineClasses = className;
            this.showMenuTab = true;
            this.toolBarColor = color;
            setTimeout(()=> {
              // console.log(this.line);
              const lineElement = this.line.nativeElement;
              lineElement.classList.add('lineOpen')
            }, 200)
           
              
            
            
          } else{
            this.showMenuTab = false;
          }


          
          
        })
    

    this.actions= [
    {name: 'Log out', color: 'green', icon: 'sign-out'},
    {name: 'Home', color: 'green', icon: 'home'},
    {name: 'My profile', color: 'orange', icon: 'user'},
    {name: 'Store', color: 'black', icon: 'shopping-cart'},
    
    ];

    
    
  }

  changeActiveTab(tabName, color, position){
    // console.log(tabObject)
    // console.log(tabObject.index)
    this.tabSubject.next(tabName)
    let positionClass = 'left'+ JSON.stringify(position) +'_'+ JSON.stringify(this.tabs.length);
    let className = positionClass+ ' border-' + color;
    // console.log(positionClass, className)
    const lineElement = this.line.nativeElement;
    lineElement.classList.remove('lineOpen');
    setTimeout(()=> {
      this.lineClasses = className;
    }, 200)
    setTimeout(()=> {
      lineElement.classList.add('lineOpen')
      
    }, 500)
    
    this.toolBarColor = color;
    // console.log(tabName)
    this.localStorage.update('activeUserTab', tabName);
    this.activeTab = tabName;
    this.showMenuTab = true;
    // console.log(this.showMenuTab);
    // this.router.navigateByUrl('/tournaments/'+this.id+'/' +this.activeTab);
  }

  toolBarActionClicked(event){
    console.log(event);
    switch(event) { 
      case 'My profile': { 
         this.goToMyProfile() 
         break; 
      } 
      case 'Home': { 
         this.goToHomepage()
         break; 
      } 
      default: { 
         //statements; 
         break; 
      } 
   } 
  }

  goToMyProfile(){
    this.router.navigateByUrl('/users/'+this.currentUser._id);

  }
  goToHomepage(){
    this.router.navigateByUrl('/');

  }

  setWidthClass(numElements:number){
    return 'width'+ JSON.stringify(numElements)
  }
  setPositionClass(position:number, numElements:number){
    return 'left'+ JSON.stringify(position) +'_' +JSON.stringify(numElements)
  }

  

  
}
