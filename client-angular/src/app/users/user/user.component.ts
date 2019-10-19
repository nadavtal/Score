import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user.model';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  // @Input() user: User
  user: User;
  id: string;
  path:any;
  tab:any;
  loaded: boolean= false;
  constructor(private usersService: UsersService,
              private route: ActivatedRoute,
              private router: Router ) { }

  ngOnInit() {
   
    this.route.params
      .subscribe(
        (params: Params) => {
          // console.log(params)
          this.id = params['userId'];
          this.usersService.getUserFromDb(this.id)
            .subscribe((user:any) => {
              console.log('URL CHANGED FETCHING USER')
              this.user = user.data
              console.log('user in userComponent', this.user);
              this.usersService.setUser(this.user);
              this.usersService.userSelected.next(this.user);
              this.loaded = true;

            })
        }
      );
    // this.onSelected();
  }

  onSelected(){
    this.usersService.userSelected.next(this.user)
  }

}
