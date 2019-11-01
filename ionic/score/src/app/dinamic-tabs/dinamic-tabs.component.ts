import { Component, OnInit, ElementRef, ViewChild, Input, Output } from '@angular/core';

import { ActivatedRoute, Params, Router, Event, NavigationStart, NavigationEnd, NavigationError, RoutesRecognized } from '@angular/router';
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
  animations: [
    trigger('tabsAnimation', [
      transition('*=>*', [
        query('.cubeMenuItem', style({opacity: 0, transform: 'translateX(100vw)'})),
        query('.cubeMenuItem', stagger('150ms', [
          animate('150ms ease-out', style({opacity: 1, transform: 'translateX(0)'}))
        ]))
      ])
    ])
  ]
})
export class DinamicTabsComponent implements OnInit {
  @ViewChild('lineBreak', {static: false}) line: ElementRef;

  tabs: any;
  activeTab: string;
  widthClass: string;
  showMenuTab = false;
  id: string;
  component: string;
  
  lineClasses: string;
  currentUser: any;
  actions: any;
  toolBarColor: string;
  tab: any;
  @Input() isUser: boolean;
  @Input() path: string;
  @Input() routeMode: any;
  @Output() tabSubject = new Subject<any>();

  constructor(private route: ActivatedRoute,
              private localStorage: localStorageService,
              private usersService: UsersService,
              private router: Router,
              private tournamentsService: TournamentsService
              ) {

               }

  ngOnInit() {
    this.router.events.subscribe( (event: Event) => {
      if (event instanceof NavigationStart) {
        //  console.log('NavigationStart', event) // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
          // Hide loading indicator
          console.log('NavigationEnd', event);
          this.tab = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
          console.log(this.tab);
          for (const tab of this.tabs) {
            if (tab.name === this.tab) {
              this.showMenuTab = true;
              this.activeTab = this.tab;
              break;
            } else {
              this.showMenuTab = false;
            }
          }

          console.log(this.showMenuTab);
      }

      if (event instanceof NavigationError) {
          // Hide loading indicator

          // Present error to user
          console.log(event.error);
      }
      if (event instanceof RoutesRecognized) {

        console.log(event.state);

    }
    });
    // console.log(this.route)
    this.tab = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
    if (this.tab.length < 20) {
      this.activeTab = this.tab;

    }
    // console.log(this.route.parent);
    console.log(this.path, this.tab);

    this.currentUser = this.localStorage.get('currentUser');
    this.route.params
      .subscribe(
        (params: Params) => {
          // console.log(params);
          if (this.path === 'home') {

            this.tabs = [
              {name: 'Tournaments', color: 'green', icon: 'trophy', index: 0},
              {name: 'Games', color: 'orange', icon: 'gamepad', index: 1},
              {name: 'Leagues', color: 'pink', icon: 'trophy', index: 2},
              {name: 'Groups', color: 'blue', icon: 'users', index: 3},

            ];


          } else if (this.path === 'users') {

            this.id = params.userId;
            if (this.isUser) {
              this.tabs = [
                {name: 'Profile', color: 'green', icon: 'user', index: 0},
                {name: 'Accounts', color: 'orange', icon: 'id-card', index: 1},
                {name: 'Groups', color: 'blue', icon: 'users', index: 2},
                {name: 'Friends', color: 'purple', icon: 'heart', index: 3},
                {name: 'Games', color: 'black', icon: 'gamepad', index: 4},
                {name: 'Messages', color: 'pink', icon: 'comments', index: 5},
              ];
            } else {

              this.tabs = [
                {name: 'Profile', color: 'green', icon: 'user', index: 0},
                {name: 'Accounts', color: 'orange', icon: 'id-card', index: 1},
                {name: 'Groups', color: 'blue', icon: 'users', index: 2},
                {name: 'Friends', color: 'purple', icon: 'heart', index: 3},
                // {name: 'Games', color: 'black', icon: 'gamepad', index: 4},
                // {name: 'Messages', color: 'pink', icon: 'comments', index: 5},
              ];
            }


          } else if (this.path === 'groups') {
            this.id = params.groupId;

            this.tabs = [
              {name: 'Info', color: 'green', icon: 'info'},
              {name: 'Stats', color: 'orange', icon: 'signal'},
              {name: 'Games', color: 'black', icon: 'gamepad'},
              {name: 'Messages', color: 'pink', icon: 'comments'},
            ];
          } else if (this.path === 'tournaments') {
            this.activeTab = 'Info';
            this.showMenuTab = true;
            this.id = params.tournamentId;

            this.tabs = [
              {name: 'Info', color: 'green', icon: 'info'},
              {name: 'Structure', color: 'orange', icon: 'gamepad'},
              {name: 'Prizes', color: 'black', icon: 'users'},

            ];

          } else if (this.path === 'accounts') {
            this.routeMode = false;
            this.id = params.accountId;
            this.activeTab = 'Info';
            this.tabs = [
              {name: 'Info', color: 'black', icon: 'info'},
              {name: 'Battles', color: 'orange', icon: 'gamepad'},


            ];

          }
          this.widthClass = this.setWidthClass(this.tabs.length);
          // console.log(this.widthClass, this.activeTab);

          console.log(this.route.parent);
          if (this.route.firstChild) {
            this.activeTab = this.route.firstChild.routeConfig.path;

          }

          if (this.activeTab) {

            let color: string;
            let tabIndex: number;
            for (let i = 0; i < this.tabs.length; i++) {
              if (this.tabs[i].name === this.activeTab) {
                color = this.tabs[i].color;
                tabIndex = i;
                break;
              }
            }

            // console.log(this.activeTab)
            const positionClass = this.setPositionClass(tabIndex, this.tabs.length);
            const className = positionClass + ' border-' + color;
            console.log(className);
            this.lineClasses = className;
            this.showMenuTab = true;
            this.toolBarColor = color;
            setTimeout(() => {
              // console.log(this.line);
              const lineElement = this.line.nativeElement;
              lineElement.classList.add('lineOpen');
            }, 200);




          } else {
            // this.showMenuTab = false;
          }




        });


    this.actions = [
    {name: 'Log out', color: 'green', icon: 'sign-out'},
    {name: 'Home', color: 'green', icon: 'home'},
    {name: 'My profile', color: 'orange', icon: 'user'},
    {name: 'Store', color: 'black', icon: 'shopping-cart'},

    ];



  }

  changeActiveTab(tabName, color, position) {
    // console.log(tabObject)
    // console.log(tabObject.index)
    this.tabSubject.next(tabName);
    const positionClass = 'left' + JSON.stringify(position) + '_' + JSON.stringify(this.tabs.length);
    const className = positionClass + ' border-' + color;
    // console.log(positionClass, className)
    const lineElement = this.line.nativeElement;
    lineElement.classList.remove('lineOpen');
    setTimeout(() => {
      this.lineClasses = className;
    }, 200);
    setTimeout(() => {
      lineElement.classList.add('lineOpen');

    }, 500);

    this.toolBarColor = color;
    // console.log(tabName)
    this.localStorage.update('activeUserTab', tabName);
    this.activeTab = tabName;
    this.showMenuTab = true;
    console.log(this.routeMode);
    if (this.routeMode === true) {
      if (this.id) {
        this.router.navigateByUrl('/' + this.path + '/' + this.id + '/' + this.activeTab);
      } else {
        this.router.navigateByUrl('/' + this.path + '/' + this.activeTab);
      }
    }
  }

  toolBarActionClicked(event) {
    console.log(event);
    switch (event) {
      case 'My profile': {
         this.goToMyProfile();
         break;
      }
      case 'Home': {
         this.goToHomepage();
         break;
      }
      case 'Log out': {
         this.logout();
         break;
      }
      default: {
         //statements;
         break;
      }
   }
  }

  logout() {
    this.localStorage.remove('currentUser');
    this.goToHomepage();

  }

  goToMyProfile() {
    this.router.navigateByUrl('/users/' + this.currentUser._id);

  }
  goToHomepage() {
    this.router.navigateByUrl('/home');

  }

  setWidthClass(numElements: number) {
    return 'width' + JSON.stringify(numElements);
  }
  setPositionClass(position: number, numElements: number) {
    return 'left' + JSON.stringify(position) + '_' + JSON.stringify(numElements);
  }




}
