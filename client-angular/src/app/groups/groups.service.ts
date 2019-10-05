import { Group } from './group.model';
import { QueryService } from '../shared/services/query.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { group } from '@angular/animations';

@Injectable()
export class GroupsService {
    newGroupCreated =  new Subject<any>()
    groupDeleted =  new Subject<any>()
    

    constructor(private query:QueryService){

    }

    createGroup(group:any){
        return this.query.post('groups', group)
    }
    deleteGroup(id:string){
        return this.query.post('groups/'+id, null)
    };

    getGroups(){
        return this.query.get('groups')
    };

    getGroup(id:string){
        return this.query.get('groups/'+id)
    };

    getGroupsByUserID(userId:string){
       return this.query.get('users/'+userId + '/groups')
    }
    getGroupsManagedByUserID(userId:string){
       return this.query.get('users/'+userId + '/groups/managed')
    }

    getGroupFromDb(groupId:string){
        return this.query.get('groups/'+groupId)
    }

    editGroup(group:any){
        return this.query.put('groups/'+group._id, group)
    }
    
}