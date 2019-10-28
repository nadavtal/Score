import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';

@Component({
  selector: 'app-calculate-prize-pool',
  templateUrl: './calculate-prize-pool.component.html',
  styleUrls: ['./calculate-prize-pool.component.scss']
})
export class CalculatePrizePoolComponent implements OnChanges {
  @Input() tournament: any;
  @Input() editMode: boolean;
  @Input() placesPaid: number;
  places(placesPaid): any[] {
    return Array(placesPaid);
  }
  constructor() { }

  ngOnInit() {
    
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    for (let propName in changes) {
      let chng = changes[propName];
      let cur  = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
  }

}
