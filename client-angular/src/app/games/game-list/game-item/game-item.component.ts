import { Component, OnInit, Input } from '@angular/core';
import { Utils } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-game-item',
  templateUrl: './game-item.component.html',
  styleUrls: ['./game-item.component.scss']
})
export class GameItemComponent implements OnInit {
  @Input() game:any;
  registered:boolean;
  constructor(private utils: Utils) { }

  ngOnInit() {
    
  }

}
