import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { User } from '../user.model';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SwalService } from 'src/app/shared/services/swal.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SubSink } from '../../../../node_modules/subsink/dist/subsink';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit , OnDestroy {
  user: User;
  id: string;
  path: any;
  tab: any;
  loaded = false;
  swalTitle: string;
  swalText: string;
  swalType: string;
  swalTimer: number;
  showConfirmButton = true;
  showCancelButton = true;

  @ViewChild('userSwal', {static: false}) private userSwal: SwalComponent;

  private subs = new SubSink();
  constructor(private usersService: UsersService,
              private route: ActivatedRoute,
              private swalService: SwalService ) { }

  ngOnInit() {

    const self = this;
    this.subs.sink = this.route.params
      .subscribe(
        (params: Params) => {
          console.log(params);
          this.id = params.userId;
          this.subs.sink = this.usersService.getUserFromDb(this.id)
            .subscribe((user: any) => {
              console.log('URL CHANGED FETCHING USER');
              this.user = user.data;
              console.log('user in userComponent', this.user);
              this.usersService.setUser(this.user);
              this.usersService.userSelected.next(this.user);
              this.loaded = true;

            });
        }
      );
    this.subs.sink = this.swalService.swal
      .subscribe((swalData: any) => {

        console.log(swalData);
        this.swalTitle = swalData.title;
        this.swalText = swalData.text;
        this.swalType = swalData.type;
        this.swalTimer = swalData.timer;
        this.showConfirmButton = swalData.showConfirmButton;
        this.showCancelButton = swalData.showCancelButton;
        setTimeout(() => {
          self.userSwal.fire();
        }, 50);

      });

    }



  swalConfirm(event) {
    console.log(event);
  }
  handleRefusal(event) {
    console.log(event);
  }

  onSelected() {
    this.usersService.userSelected.next(this.user);
  }

  onBeforeOpen(event) {
    console.log(event);
  }

  onRender(event) {
    console.log('RENDEREr', this.swalTitle);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
