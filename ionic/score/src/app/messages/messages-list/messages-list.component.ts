import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss']
})
export class MessagesListComponent implements OnInit {
  @Input() messages:any;
  constructor() { }

  ngOnInit() {
    console.log(this.messages)
  }

}
