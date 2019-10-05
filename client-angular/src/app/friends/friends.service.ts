import { Injectable } from '@angular/core';
import { User } from '../users/user.model';


@Injectable()
export class FriendsService {

    searchFriends(user:User){
        console.log(user.friends)
    }

}