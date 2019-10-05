import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-clash-royale-battle',
  templateUrl: './clash-royale-battle.component.html',
  styleUrls: ['./clash-royale-battle.component.scss']
})
export class ClashRoyaleBattleComponent implements OnInit {
  @Input() battle:any;
  constructor() { }

  ngOnInit() {
  }

}
