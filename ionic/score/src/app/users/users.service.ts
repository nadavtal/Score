import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { QueryService } from '../shared/services/query.service';
import { localStorageService } from '../shared/services/local-storage.service';

@Injectable({providedIn: 'root'})
export class UsersService {
    user: User;
    userSelected = new Subject<User>();
    // private users: User[] = [
    //     new User(1,'Nadi','Nadav','Almagor','asd', 'nadavtalalmagor@gmail.com', 'admin'),
    //     new User(2,'Fatz','Tal','Almagor','Akta', 'tal@gmail.com', 'user'),
    //     new User(3,'Gads','Gadi','Grosz','asd', 'gadi1@gmail.com', 'user'),
    //     new User(4,'Yos','Yosi','Gez','asd', 'yosi@gmail.com', 'user'),
    //     new User(5,'Iris','Iris','Tokatly','asd', 'iris@gmail.com', 'user'),
    //     new User(6,'Eli','Eli','Yahu','asd', 'eli@gmail.com', 'user'),
    // ];

    constructor(
        private query: QueryService,
        private localStorageService: localStorageService) {}

    getUsers() {
        return this.query.get('users/');
    }

    setUser(user: User) {
        this.user = user;
        // sconsole.log('User set: ', this.user)
    }
    getUser() {
       return this.user ;
    }

    updateUser(user: any) {
        return this.query.put('users/' + user._id, user);
    }

    getUserFromDb(id: string) {

        return this.query.get('users/' + id);
    }

    checkIfUserBalanceHasSufficientFunds(user: any, amount: number) {
        if (user.balance - amount < 0) {
            return false;
        } else {

            return true;
        }
    }

    updateUserBalance(user, amount: number) {
        user.balance += amount;

    }

    checkIfUserIsCurrentUser(userId: string) {
        if (userId === this.localStorageService.get('currentUser')._id) {
            return true;
        } else {
            return false;
        }
    }
}
