import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { UsersService } from 'src/app/users/users.service';
import { localStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-icon-actions',
  templateUrl: './icon-actions.component.html',
  styleUrls: ['./icon-actions.component.scss']
})
export class IconActionsComponent implements OnInit {
  @Output()action = new Subject<any>();
  @Input() actions: any;
  isUser: boolean;
  constructor(private usersService: UsersService,
              ) { }

  ngOnInit() {
    // this.isUser = this.usersService.checkIfUserIsCurrentUser(this.user);
    // console.log(this.actions)
  }

  actionClicked(event, actionName) {
    // console.log(event.path[2]);
    if (event.path[2].classList.contains('rotate')) {
      event.path[2].classList.remove('rotate');
    } else {
      event.path[2].classList.add('rotate');

    }
    this.action.next(actionName);
  }

}
