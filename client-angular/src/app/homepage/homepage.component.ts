import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { listAnimation} from '../shared/animations';
import { ActivatedRoute, Params, Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { localStorageService } from '../shared/services/local-storage.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SwalService } from '../shared/services/swal.service';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';
import { SubSink } from 'node_modules/subsink/dist/subsink';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  animations: [listAnimation]
})
export class HomepageComponent implements OnInit, OnDestroy{
  tabs:any;
  tab:any;
  activeTab:string;
  showMenuTabs: boolean =false;
  currentUser: any;
  swalTitle:string;
  swalText:string;
  swalType:string;
  swalTimer:number;
  showConfirmButton:boolean = true;
  showCancelButton:boolean = true;
  swalOptions:any = {};
  loginMode: boolean = true;
  @ViewChild('userSwal', {static: false}) private userSwal: SwalComponent;
  @ViewChild('loginSweetAlert', {static: false}) private loginSweetAlert: SwalComponent;
  @ViewChild('loginForm', {static: false}) private loginForm: NgForm;

  private subs = new SubSink();
  constructor(private route: ActivatedRoute,
            private localStorage: localStorageService,
            public readonly swalTargets: SwalPortalTargets,
            private swalService: SwalService,
            private authService: AuthService,
            private router: Router) { }

  ngOnInit() {
    var self = this;
    this.subs.sink = this.swalService.loginSwal
      .subscribe((action) => {
        console.log(action)
        this.loginSweetAlert.fire()
      })
    this.subs.sink = this.swalService.swal
      .subscribe((swalData:any)=>{

        console.log(swalData)
        this.swalTitle = swalData.title;
        this.swalText = swalData.text;
        this.swalType = swalData.type;
        this.swalTimer = swalData.timer;
        this.showConfirmButton = swalData.showConfirmButton;
        this.showCancelButton = swalData.showCancelButton;
        this.swalOptions = swalData.swalOptions
        setTimeout(function(){
          self.userSwal.fire()
        },50)

      })
    this.currentUser = this.localStorage.get('currentUser');
    console.log(this.currentUser)
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
    this.subs.sink = this.router.events.subscribe( (event: Event) => {

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
    this.subs.sink = this.route.params
      .subscribe((params:Params) =>{
        console.log(params)
      })
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  dinamicTabsClicked(event){
    this.activeTab = event;
    this.showMenuTabs = true
    console.log(event)

  }

  swalConfirm(options){
    console.log(options)
    if(options.action == 'deposit'){
      console.log('DEPOSITTTTTTT')
    }
    else if (options.action == 'login/signup'){
      this.loginSweetAlert.fire()
    }


  }

  onSubmit(values: any ){
    console.log(values);
    if(this.loginMode){
      this.login(values.userName, values.password);
    } else{
      this.signUp(values.userName, values.email, values.password);
    }


  }

  signUp(userName, email, password){
    const userData = {
      userName: userName,
      email: email,
      password: password
    }
    console.log(userData)
    this.subs.sink = this.authService.signUp(userData)
    .subscribe((data:any)=>{
      console.log(data)
    }, error => {
      console.log(error);

      // this.error = error
    })
  }
  login(userName, password){
    const userData = {
      userName: userName,
      password: password
    }
    console.log(userData)
    this.subs.sink = this.authService.login(userData)
    .subscribe((user:any)=>{
      console.log(user);
      this.localStorage.set('currentUser', user.data.user);
      this.localStorage.set('token', user.data.token);

      this.currentUser = this.localStorage.get('currentUser');
      this.goToMyProfile()
      // console.log(window.localStorage)


    }, error => {
      console.log(error);

    })
  }

  toggleLoginMode(){
    console.log(this.loginMode)
    this.loginMode = !this.loginMode
  }

  handleRefusal(event){
    console.log('Tournament joined canceled by user')
  }

  goToMyProfile(){
    this.router.navigateByUrl('/users/'+this.currentUser._id);

  }


}
