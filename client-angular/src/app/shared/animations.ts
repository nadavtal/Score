
import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
export const listAnimation = trigger('listAnimation',  [
    transition('* => *', [
      query(':enter', style({opacity:0}), {optional:true}),
      query(':enter', stagger('100ms', [
        animate('400ms ease-in', keyframes([
          style({opacity:0, transform: 'translateY(-75px)', offset:0}),
          style({opacity:.5, transform: 'translateY(35px)', offset:.3}),
          style({opacity:1, transform: 'translateY(0)', offset:1}),
        ]))
      ]), {optional:true}) ,
      query(':leave', style({opacity:0}), {optional:true}),
        
          // animate('100ms ease-in', keyframes([
          //   style({opacity:1, transform: 'translateX(-75px)', offset:0}),
          //   style({opacity:.5, transform: 'translateX(100vw)', offset:.9}),
          //   style({opacity:0, transform: 'translateX(100vw)', offset:1}),
          // ])),
    ]),
  ])

export const moveInUp = trigger('moveInUp', [
    transition('void => *', [
        query(':enter', style({opacity:0}), {optional:true}),
        
          animate('1s ease-in', keyframes([
            style({opacity:0, transform: 'translateY(-75px)', offset:0}),
            style({opacity:.5, transform: 'translateY(35px)', offset:.3}),
            style({opacity:1, transform: 'translateY(0)', offset:1}),
          ])),
       
      ]),
  ])

export const moveInLeft = trigger('moveInLeft', [
    transition('void => *', [
      query(':enter', style({opacity:0}), {optional:true}),
      
        animate('500ms ease-in', keyframes([
          style({opacity:0, transform: 'translateX(-100vw)', offset:0}),
          style({opacity:.5, transform: 'translateX(35px)', offset:.3}),
          style({opacity:1, transform: 'translateX(0)', offset:1}),
        ])),
    
    ]),
  ])
  export const moveOutRight = trigger('moveOutRight', [
    transition('* => void', [
      
      query(':enter', style({opacity:0}), {optional:true}),
        
          animate('400ms ease-in', keyframes([
            style({opacity:1, transform: 'translateX(0)', offset:0}),
            style({opacity:.5, transform: 'translateX(-35px)', offset:.3}),
            style({opacity:0, transform: 'translateX(100vw)', offset:1}),
          ])),
      
    ]),
  ])
  
