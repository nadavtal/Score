import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss']
})
export class ShareButtonComponent implements OnInit {
  positions: {};
  constructor() { }

  ngOnInit() {
    this.positions = {
      bottom: 'bottom',
      right: 'right',
      left: 'left',
      top: 'right',
      below: 'below',
      
  }
  }

}
