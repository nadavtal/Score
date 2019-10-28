import { EventEmitter, Injectable, OnInit, OnDestroy } from '@angular/core';
import { Game } from './game.model';
import { QueryService } from '../shared/services/query.service';
import { UsersService } from '../users/users.service';
import { TransactionsService } from '../transactions/transaction.service';
import { Utils } from '../shared/services/utils.service';
import { localStorageService } from '../shared/services/local-storage.service';
import { MessagesService } from '../messages/messages.service';
import { SubSink } from 'node_modules/subsink/dist/subsink'

@Injectable({providedIn: 'root'})
export class GamesService implements OnInit, OnDestroy{
    private subs = new SubSink();
    constructor(private query: QueryService,
                private usersService: UsersService,
                private utilsService: Utils,
                private messagesService: MessagesService,
                private localStorage: localStorageService,
                private transactionsService: TransactionsService){}

    ngOnInit(){
        console.log('GamesService')
        // this.createRandomGames(100)
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
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

    gameRegistration(action: string, game:any, user:any){
        var promise = new Promise((resolve, reject) => {
            var self = this
            var transaction:any;
            var message:any;
            console.log(action)
            if(action == 'Game Registration'){
                if (!this.usersService.checkIfUserBalanceHasSufficientFunds(user, parseInt(game.buyIn))){
                    resolve('Insufficient funds')
                } 
                else{
                    transaction = {
                        transactionType: action,
                        userId: user._id,
                        gameId: game._id,
                        amount: -game.buyIn
            
                    }

                    message = 'Registered from game: ' + game.name + '. Your account was charged ' + game.buyIn
                    
                    game.players.push({
                        userName: user.userName,
                        userId: user._id
                    });
                }
            } 
            else if (action == 'Game UnRegistration'){
                transaction = {
                    transactionType: action,
                    userId: user._id,
                    gameId: game._id,
                    amount: game.buyIn
            
                }
                message = 'Unregistered from game: ' + game.name + '. Your account was refunded ' + game.buyIn
                game.players = this.utilsService.removeUserFromArrayByUserId(game.players, user._id);
            }
            
            

            this.transactionsService.createTransaction(transaction)
                .subscribe((createdTransaction:any) => {
                console.log('Transaction created: ',  createdTransaction.data);
                
                user.balance += createdTransaction.data.amount
                this.usersService.updateUser(user)
                    .subscribe((updatedUser:any) => {
                    user = updatedUser.data;
                    this.usersService.userSelected.next(updatedUser.data);
                    this.localStorage.update('currentUser', user)
                    
                    
                    // game.prizePool =  self.calculatePrizePool(game);
                    self.editGame(game)
                        .subscribe((updatedGame:any)=> {
                            self.gameSelected.next(updatedGame.data);
                            this.subs.sink = this.messagesService.createLogMessage( 
                                action, 
                                message,
                                user, 
                                {gameId: updatedGame.data._id} )
                                .subscribe((createdMessage:any) => {
                                    console.log('createdMessages',createdMessage)
                                    resolve({updatedGame: game, updatedUser: user})
                         
                                })
                        },
                        error => {
                            reject({'errorInEditingGame': error})
                        })
                    // this.saveGame('Registered to ' +game.name, 'Your account was charged '+ game.buyIn + '. GOOD LUCK!');
                    
                    },
                    error => {
                        reject({'errorInUpdatingUser': error})
                    })
                },
                error => {
                    reject({'errorIncreatingTransaction': error})
                })


        })
        
        return promise
    }

    gameCreation(game:any, currentUser, group){
        let promise = new Promise((resolve, reject) => {
            game.host = currentUser.userName;
            if(group){
            game.group = {
                groupId: group._id,
                groupName: group.groupName
            }

            } 
            game.players = [{userName: currentUser.userName,
                            userId: currentUser._id}]
            this.subs.sink = this.createGame(game)
            .subscribe((newGame:any) => {
                console.log('new game created', newGame.data);
                this.subs.sink = this.messagesService.createLogMessage( 
                    'Game created: '+ newGame.data.name, 
                    '',
                    currentUser, 
                    {gameId: newGame.data._id} 
                    )
                    .subscribe((createdMessage:any) => {
                        console.log('createdMessage',createdMessage);
                        var message:any = {
                            subject : 'Game on!!',
                            content: 'New game of '+ game.platform + ' and buyin of '+ game.buyIn + ' created by '+ currentUser.userName,
                            messageType : 'notification',
                            sender:{
                                userName: currentUser.userName,
                                userId: currentUser._id
                            },
                            links: {
                                gameId: newGame.data._id,
                                userId: currentUser._id
                                
                            }
                        }
                        if(group){
                        
                            message.content = 'New game of '+ game.platform + ' and buyin of '+ game.buyIn + ' created by '+ currentUser.userName + ' in '+ group.groupName + ' group',
                            message.links.groupId = group._id;
                            message.links.groupName = group.groupName
                    
                        } 
                        console.log(message)
                        if(group){
                            this.messagesService.createMessagePerUser(group.members, message)
                                .then((createdMessages:any) => {
                                    console.log('createdMessages',createdMessages)
                                    resolve({updatedGame: newGame.data, updatedUser: currentUser})
                                }, error => {
                                    reject(error)
                                })
                    
                        } 
                        else{
                            this.messagesService.createMessagePerUser(currentUser.friends, message)
                                .then((createdMessages:any) => {
                                    console.log('createdMessages',createdMessages)
                                    resolve({updatedGame: newGame.data, updatedUser: currentUser})
                                }, error => {
                                    reject(error)
                                })
                        }
                        
             
                    }, error => {
                        reject(error)
                    })
               

                var message:any = {
                    subject : 'Game on!!',
                    content: 'New game of '+ game.platform + ' and buyin of '+ game.buyIn + ' created by '+ currentUser.userName,
                    messageType : 'notification',
                    sender:{
                        userName: currentUser.userName,
                        userId: currentUser._id
                    },
                    links: {
                        gameId: newGame.data._id,
                        userId: currentUser._id
                        
                    }
                }
                if(group){
                
                    message.content = 'New game of '+ game.platform + ' and buyin of '+ game.buyIn + ' created by '+ currentUser.userName + ' in '+ group.groupName + ' group',
                    message.links.groupId = group._id;
                    message.links.groupName = group.groupName
            
                } 
                console.log(message)
                if(group){
                    this.messagesService.createMessagePerUser(group.members, message)
                        .then((createdMessages:any) => {
                            console.log('createdMessages',createdMessages)
                            resolve(newGame.data)
                        }, error => {
                            reject(error)
                        })
            
                } else{
                    this.messagesService.createMessagePerUser(currentUser.friends, message)
                        .then((createdMessages:any) => {
                            console.log('createdMessages',createdMessages)
                            resolve(newGame.data)
                        }, error => {
                            reject(error)
                        })
                }
            
            }, error => {
                reject(error)
            });
        })

        return promise
    }

  
}