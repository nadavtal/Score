import { Component, OnInit, Input } from '@angular/core';
import { Utils } from 'src/app/shared/services/utils.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { GamesService } from '../../games.service';

@Component({
  selector: 'app-game-item',
  templateUrl: './game-item.component.html',
  styleUrls: ['./game-item.component.scss']
})
export class GameItemComponent implements OnInit {
  @Input() game:any;
  @Input() currentUser:any;
  registered:boolean;
  constructor(private utils: Utils,
              private swalService: SwalService,
              private gamesService: GamesService
              ) { }

  ngOnInit() {
    if(this.currentUser){
      this.registered = this.utils.checkIfUserInArrayByUsername(this.game.players, this.currentUser.userName);

    }
    
  }

  fllipingButtonClicked(event){
    console.log(event)
    if(event == 'falseFunction'){
      this.leaveGame(this.game)
    } else {
      this.joinGame(this.game)
    }
    
  }

  joinGame(game:any){
    console.log('joining')
    if(!this.currentUser){
      console.log('NOT LOGGED IN')
      this.swalService.swal
      .next({
        title: 'Not logged in',
        text: "You must be logged in to register",
        type: "error",
        showConfirmButton: true,
        showCancelButton: true,
        swalOptions: { confirmButtonText: 'Login',
                        action: 'login/signup'}
      })
    } else{
      this.gamesService.gameRegistration('Game Registration', game, this.currentUser)
        .then((data:any)=>{
          console.log(data);
          if(data == 'Insufficient funds'){
            this.swalService.swal
              .next({
                title: 'Insufficient funds',
                text: "Please add funds to your account",
                type: "error",
                showConfirmButton: true,
                showCancelButton: true,
                swalOptions: { confirmButtonText: 'Go to cashier',
                               action: 'deposit'}
              })
          
          }
          if(data.updatedGame){
            this.swalService.swal
              .next({
                title: 'Registered!',
                text: "Your account was charged: " + data.updatedGame.buyIn + ' GOOD LUCK!',
                type: "success",
                timer: 2000,
                showConfirmButton: false,
                showCancelButton: false,
                swalOptions: {}
              })
           
            this.game = data.updatedGame
            this.registered = this.utils.checkIfUserInArrayByUsername(this.game.players, this.currentUser.userName);
          }
        })

    }
   
   
    
  }


  leaveGame(game:any){
    console.log('leaving')
    if(!this.currentUser){
      console.log('NOT LOGGED IN')
      this.swalService.swal
      .next({
        title: 'Not logged in',
        text: "You must be logged in to register",
        type: "error",
        showConfirmButton: true,
        showCancelButton: true,
        swalOptions: { confirmButtonText: 'Login',
                        action: 'login/signup'}
      })
    } else{
      this.gamesService.gameRegistration('Game UnRegistration', game, this.currentUser)
      .then((data:any)=>{
        
        if(data.updatedGame){
          this.swalService.swal
            .next({
              title: 'Pussy!',
              text: "Just kidding...your account was refunded " + data.updatedGame.buyIn + ' See you soon',
              type: "success",
              timer: 2000,
              showConfirmButton: false,
              showCancelButton: false,
              swalOptions: {}
            })
        
            this.game = data.updatedGame
            this.registered = this.utils.checkIfUserInArrayByUsername(this.game.players, this.currentUser.userName);
        }
      })
    }
    
    
  }

}
