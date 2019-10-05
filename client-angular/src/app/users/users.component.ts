import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from './user.model';
import { UsersService } from './users.service';
import { QueryService } from '../shared/services/query.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  // private errorSub: Subscription
  users: User[];
  constructor() { }

  ngOnInit() {
    // this.errorSub = this.queryService.error.subscribe(errorMessage =>{
    //   console.log(errorMessage)
    // })
  }

  ngOnDestroy(){
    // this.errorSub.unsubscribe();
  }

}
