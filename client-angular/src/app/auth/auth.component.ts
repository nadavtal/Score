import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';
import { QueryService } from '../shared/services/query.service';
import { localStorageService } from '../shared/services/local-storage.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  email:string;
  password:string ='asd';
  userName:string ="Nadi";
  loginMode: boolean = true;
  error:string;
  
  constructor(private authService: AuthService,
              private query: QueryService, 
              private localStorage: localStorageService) { }

  ngOnInit() {
  }

  signUp(){
    const userData = {
      userName: this.userName,
      email: this.email,
      password: this.password
    }
    console.log(userData)
    this.authService.signUp(userData)
    .subscribe((data:any)=>{
      console.log(data)
    }, error => {
      console.log(error);
      
      this.error = error
    })
  }
  login(){
    const userData = {
      userName: this.userName,
      password: this.password
    }
    console.log(userData)
    this.authService.login(userData)
    .subscribe((user:any)=>{
      console.log(user);
      this.localStorage.set('currentUser', user.data)
    }, error => {
      console.log(error);
      this.error = error
    })
  }
  logout(){
    this.localStorage.remove('currentUser')
  }

  onSubmit(loginForm: NgForm){
    console.log(loginForm);
    if(this.loginMode){
      this.login();
    } else{
      this.signUp();
    }
     
    
  }

}
