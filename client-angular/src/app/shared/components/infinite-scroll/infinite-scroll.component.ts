import { Component, Input, OnInit } from '@angular/core';
import { InfinitScrollService } from './infinite-scroll.service';
import { ArraySortPipe } from '../../pipes/sort.pipe';



@Component({
    selector: 'app-infinite-scroll',
    styleUrls: ['./infinite-scroll.scss'],
    templateUrl: './infinite-scroll.component.html',
    providers: [ArraySortPipe]
   
  })
export class InfiniteScrollComponent implements OnInit{
    array = [];
    sum = 10;
    throttle = 50;
    scrollDistance = 2;
    scrollUpDistance = 2;
    direction = '';
   
    @Input() dataArray:any
    
  
    constructor(private inifiniteScrollService: InfinitScrollService,
                private sort : ArraySortPipe) {
        
      
    }

    ngOnInit(){
        // console.log('akjsdhaksjdhkajhsdkjsahd')
        this.inifiniteScrollService.infiniteScrollData
        .subscribe(dataArray => {
            this.dataArray = dataArray
            console.log(this.dataArray);
            this.dataArray = this.sort.transform(this.dataArray, 'battleTime');
            console.log(this.dataArray);
            this.appendItems(0, this.sum);
        }) 
    }
    
    addItems(startIndex, endIndex, _method) {
    // console.log(this.dataArray)
      for (let i = startIndex; i < endIndex; ++i) {
        console.log(i)
        this.array[_method](this.dataArray[i]);
      }
      console.log(this.array)
    }
    
    appendItems(startIndex, endIndex) {
      this.addItems(startIndex, endIndex, 'push');
    }
    
    prependItems(startIndex, endIndex) {
      this.addItems(startIndex, endIndex, 'unshift');
    }
  
    onScrollDown (ev) {
      console.log('scrolled down!!', ev);
      if (this.sum < this.dataArray.length){
        const start = this.sum;
        this.sum += 10;
        this.appendItems(start, this.sum);
        
        this.direction = 'down'
      }
      // add another 20 items
      
    }
    
    onUp(ev) {
      console.log('scrolled up!', ev);
      // const start = this.sum;
      // this.sum -= 10;
      // this.prependItems(start, this.sum);
    
      // this.direction = 'up';
    }
   
  
  }