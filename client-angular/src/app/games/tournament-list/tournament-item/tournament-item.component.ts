import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tournament-item',
  templateUrl: './tournament-item.component.html',
  styleUrls: ['./tournament-item.component.scss']
})
export class TournamentItemComponent implements OnInit {
  @Input() tournament:any;

  constructor() { }

  ngOnInit() {
    // console.log(this.tournament.registered.length)
  }

  fllipingButtonClicked(event){
    console.log(event);
    
  }

}
