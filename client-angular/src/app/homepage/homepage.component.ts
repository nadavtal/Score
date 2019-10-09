import { Component, OnInit } from '@angular/core';
import { listAnimation} from '../shared/animations'
import { ActivatedRoute, Params, Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  animations: [listAnimation]
})
export class HomepageComponent implements OnInit {
  tabs:any;
  tab:any;
  activeTab:string;
  showMenuTabs: boolean =false;
  constructor(private route: ActivatedRoute,
            private router: Router) { }

  ngOnInit() {
    this.tabs = [
      {name: 'Tournaments', color: 'green', icon: 'person', index: 0},
      {name: 'Games', color: 'orange', icon: 'settings_cell', index: 1},
      {name: 'Leagues', color: 'pink', icon: 'group', index: 2},
      {name: 'Groups', color: 'blue', icon: 'people_outline', index: 3},
     
    ];
    this.tab = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
   
    if(this.tab !== 'home'){
      this.showMenuTabs = true
    }
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
              this.showMenuTabs = true;
              break
            } else{
              this.showMenuTabs = false;
            }
          }

          console.log(this.showMenuTabs)

          
      }

      if (event instanceof NavigationError) {
          // Hide loading indicator

          // Present error to user
          console.log(event.error);
      }
    });
    this.route.params
      .subscribe((params:Params) =>{
        console.log(params)
      })
  }

  dinamicTabsClicked(event){
    this.activeTab = event;
    this.showMenuTabs = true
    console.log(event)
    
  }

}
