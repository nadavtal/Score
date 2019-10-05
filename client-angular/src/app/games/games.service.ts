import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Game } from './game.model';
import { QueryService } from '../shared/services/query.service';
import { UsersService } from '../users/users.service';

@Injectable({providedIn: 'root'})
export class GamesService implements OnInit{
    constructor(private query: QueryService,
                private usersService: UsersService){}

    ngOnInit(){
        console.log('GamesService')
        this.createRandomGames(100)
    }
    gameSelected = new EventEmitter<Game>();
    
    getGameTypes(){
        return this.query.get('gameTypes/')
    }

    getGame(gameId: string){
        return this.query.get('games/'+gameId)
    }
    createGame(game:any){
        return this.query.post('games/', game)
    }
    editGame(game:any){
        return this.query.put('games/'+game._id, game)
    }
    getGames(){
        return this.query.get('games/')
    }

    getGamesByUserID(userId:string){
        return this.query.get('games/user/'+userId)
    }

    getGamesByGroupId(groupId:string){
        return this.query.get('games/group/'+groupId)
    }

    createRandomGames(numGames){
        const platforms= ['Clash Royale', 'Poker', 'FIFA'];
        const buyIns= [0, 5, 10, 50, 100, 150, 250, 300, 400, 500, 1000];
        const playersPerGroupArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        this.usersService.getUsers()
            .subscribe((users:any) => {
                users = users.data;
                for (let i = 0; i<numGames; i++){
                    var platform = platforms[Math.floor(Math.random()*platforms.length)];
                    var buyIn = buyIns[Math.floor(Math.random()*buyIns.length)];
                    var playersPerGroup = playersPerGroupArr[Math.floor(Math.random()*playersPerGroupArr.length)];
                    var host = users[Math.floor(Math.random()*users.length)].userName;

                   const game = {
                        name: platform + ' game',
                        buyIn: buyIn,
                        platform: platform,
                        playersPerGroup: playersPerGroup,
                        host: host
                    }
                }
                
                
            })
            
    }

  
}