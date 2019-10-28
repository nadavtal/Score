import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-row',
  templateUrl: './user-row.component.html',
  styleUrls: ['./user-row.component.scss']
})
export class UserRowComponent implements OnInit {
  @Input() user:any;
  @Input() index:number;
  constructor() { }

  ngOnInit() {

  }

}
