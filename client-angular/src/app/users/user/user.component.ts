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
    // const id = this.route.snapshot.params['id'];
    // console.log(this.route.params)
    this.route.params
      .subscribe(
        (params: Params) => {
          // this.path = this.route.snapshot.url[0].path;
          // this.tab = this.route.snapshot.url[2].path;
          // console.log(this.route)
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
