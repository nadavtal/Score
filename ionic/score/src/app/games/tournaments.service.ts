import {  Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { QueryService } from '../shared/services/query.service';
import { UsersService } from '../users/users.service';
import { TransactionsService } from '../transactions/transaction.service';
import { localStorageService } from '../shared/services/local-storage.service';
import { SubSink } from 'node_modules/subsink/dist/subsink';
import { Utils } from '../shared/services/utils.service';
import { MessagesService } from '../messages/messages.service';


@Injectable({providedIn: 'root'})
export class TournamentsService implements OnDestroy {
    private subs = new SubSink();
    constructor(
        private query: QueryService,
        private usersService: UsersService,
        private transactionsService: TransactionsService,
        private utilsService: Utils,
        private localStorage: localStorageService,
        private messagesService: MessagesService,

        ) {}
    tournamentSelected = new Subject<any>();

    ngOnDestroy() {
        this.subs.unsubscribe();
      }

    getAllTournaments() {
        return this.query.get('tournaments');
    }

    getTournament(tournamentId) {
        if (!tournamentId) { return; }

        return this.query.get('tournaments/' + tournamentId);
    }

    getTournamentsByUserID(userId: string) {
        return this.query.get('tournaments/user/' + userId);
    }

    getTournamentsManagedByUserName(userName, getParams) {
        console.log(getParams);
        return this.query.get('tournaments/user/managed/' + userName, getParams);
    }
    getTournamentsByGroupID(groupId: string) {
        return this.query.get('tournaments/group/' + groupId);
    }
    editTournament(tournament: any) {
        return this.query.put('tournaments/' + tournament._id, tournament);
    }

    tournamentRegistration(action: string, tournament: any, user: any) {
        const promise = new Promise((resolve, reject) => {
            const self = this;
            let transaction;
            let message;
            let messageContent: string;
            console.log(action);
            if (action === 'Tournament Registration') {
                if (!this.usersService.checkIfUserBalanceHasSufficientFunds(user, parseInt(tournament.buyIn))) {
                    resolve('Insufficient funds');
                } else {
                    transaction = {
                        transactionType: action,
                        userId: user._id,
                        tournamentId: tournament._id,
                        amount: -tournament.buyIn

                    };
                    messageContent = 'Registered to tournament: ' + tournament.name + '. Your account was charged ' + tournament.buyIn,
                    tournament.registered.push({
                        userName: user.userName,
                        userId: user._id
                    });
                }
            } else if (action === 'Tournament UnRegistration') {
                transaction = {
                    transactionType: action,
                    userId: user._id,
                    tournamentId: tournament._id,
                    amount: tournament.buyIn
                };
                messageContent = 'Unregistered from tournament: ' + tournament.name + '. Your account was refunded ' + tournament.buyIn,
                tournament.registered = this.utilsService.removeUserFromArrayByUserId(tournament.registered, user._id);
            }


            this.subs.sink = this.transactionsService.createTransaction(transaction)
                .subscribe((createdTransaction: any) => {
                console.log('Transaction created: ',  createdTransaction.data);

                user.balance += createdTransaction.data.amount;
                this.subs.sink = this.usersService.updateUser(user)
                    .subscribe((updatedUser: any) => {
                    user = updatedUser.data;
                    this.usersService.userSelected.next(updatedUser.data);
                    this.localStorage.update('currentUser', user);


                    tournament.prizePool =  self.calculatePrizePool(tournament);
                    this.subs.sink = self.editTournament(tournament)
                        .subscribe((updatedTournament: any) => {
                            self.tournamentSelected.next(updatedTournament.data);
                            resolve(updatedTournament.data);

                        },
                        error => {
                            reject(error);
                        });
                    },
                    error => {
                        reject(error);
                    });

                },
                error => {
                    reject(error);
                });




        });

        return promise;
    }

    createMessages(){
        let promiseArr = [];
        const logMessagesPromise = new Promise((resolve, reject) => {

        });
    }

    calculatePrizePool(tournament) {

        const prizePool = tournament.buyIn * tournament.registered.length;
        // console.log(prizePool)

        // console.log(this.tournament.prizePool)
        return prizePool;
      }



}
