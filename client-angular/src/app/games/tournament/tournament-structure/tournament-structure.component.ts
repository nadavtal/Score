import { Component, OnInit } from '@angular/core';
import { TournamentsService } from '../../tournaments.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-tournament-structure',
  templateUrl: './tournament-structure.component.html',
  styleUrls: ['./tournament-structure.component.scss']
})
export class TournamentStructureComponent implements OnInit {
  id:string;
  tournament:any;
  tournamentStructureObj:any;
  loaded:boolean = false;
  constructor(private tournamentsService: TournamentsService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.tournamentsService.tournamentSelected
    .subscribe((tournament:any) => {
      this.tournament = tournament;
      // console.log('tournament received from Subject:', this.tournament);
      this.loaded = true
      if(!this.tournament.tree){
        // console.log()
        this.initializeTournament();
        // console.log(this.tournamentStructureObj)
      } else{
        this.tournamentStructureObj = JSON.parse(this.tournament.tree);
        // console.log(this.tournamentStructureObj)
      };
    })    
  }

  initializeTournament(){
    // console.log(this.tournament.registered)
    this.tournamentStructureObj = this.createTournamentStrctureObj(this.tournament);
    this.tournament.rounds = this.calcNumRounds(this.tournament.maxPlayers, this.tournament.playerPerBattle);
    var firstRoundBattles = this.drawFirstRound(this.tournament.registered, this.tournament.playerPerBattle);
    this.tournamentStructureObj[0] = firstRoundBattles;
    
  }  

  createTournamentStrctureObj(tournament:any){
    var tournamentStructureObj = {};
    var numUsers = tournament.maxPlayers;
    for (var i = 0; i< tournament.rounds; i++){

      tournamentStructureObj[i] = [];
      for(var j = 0; j< numUsers/2; j++){
        var battle = { player1: {},
                      player2: {},
                      winner: {}
        };
        tournamentStructureObj[i].push(battle);
       
      }
      numUsers = numUsers/2 
    }
    return tournamentStructureObj;
  }

  calcNumRounds(numPlayers, playerPerBattle){
    var numRounds = 0;
    while(numRounds < 100){
      numPlayers = numPlayers/playerPerBattle;
      numRounds ++;
      // console.log(numPlayers, numRounds)
      if (numPlayers == 1){
        break
        // 
      }
    }
    return  numRounds
  }

  drawFirstRound(users, playerPerBattle){
    var usersCopy = JSON.parse(JSON.stringify(users));
    var numBattles = usersCopy.length / playerPerBattle;
    // console.log(usersCopy.length)
    var battles = [];
    for(var i = 0; i < numBattles; i++){
      // console.log(users)
      var battle = { player1: {},
                    player2: {},
                    winner: {}
      };
      // console.log(usersCopy.length);
      if(usersCopy.length == 0){
        battle.player1 = {userName: '',
                          userId: ''}
      } else{
        var randomIndex = Math.floor(Math.random()*usersCopy.length);
        battle.player1 = usersCopy[randomIndex];

      }
      usersCopy.splice(randomIndex, 1);
      
      if(usersCopy.length == 0){
        battle.player2 = {userName: '',
                          userId: ''}
      } else{
        var randomIndex2 = Math.floor(Math.random()*usersCopy.length);
        battle.player2 = usersCopy[randomIndex2];
      }
      usersCopy.splice(randomIndex2, 1);
      battles.push(battle)
    }
      
    return battles
  }

  selectWinner($index,$event, battle, player, currentRound){
    // console.log($event);
    battle.winner = player;
    
    this.movePlayerToNextRound($index, $event, player, currentRound);

   
    // console.log(element);
    
    
  }

  movePlayerToNextRound(index, $event, player, currentRound){

    console.log($event);
    // var element = $($event.currentTarget);
    // console.log(element);
    var nextRoundIndex = Math.floor(index/2);
    // element.addClass('moveRight');
    // console.log(nextRoundIndex);
    // console.log(index%2);
    if (this.tournamentStructureObj[currentRound + 1 ]){
      if(index%2 === 0){
        this.tournamentStructureObj[currentRound + 1 ][nextRoundIndex].player1 = player;
        // element.addClass('moveDown');
  
      } else{
        this.tournamentStructureObj[currentRound + 1 ][nextRoundIndex].player2 = player;
        // element.addClass('moveUp');
      }
    } else{
      console.log('there are no more rounds');

    }
    
    // console.log(this.tournamentStructureObj[currentRound + 1 ][nextRoundIndex]);
    console.log(this.tournamentStructureObj);
    this.tournament.tree = JSON.stringify(this.tournamentStructureObj);
    
    this.tournamentsService.editTournament(this.tournament)
      .subscribe((tournament:any) => {
        this.tournament = tournament.data;
        console.log(this.tournament);
      })
    
  }

}
