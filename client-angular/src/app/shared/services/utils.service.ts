import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class Utils{

    findUserInArrayByUsername(array:any, userName:string){
    // console.log(array, userName)
      
      for (var i=0; i < array.length; i++) {
        
        if(array[i].userName == userName){
          var foundUser = array[i]
        }
      }
      return foundUser
    }

    checkIfUserInArrayByUsername(array:any, userName:string){
        // console.log(array, userName)
          
      for (var i=0; i < array.length; i++) {
        
        if(array[i].userName == userName){
          return true
        }
      }
      return false
    }

    removeUserFromArrayByUserId(array:any, userId:string){
      console.log(array)
      return array.filter(function(value){
        
        return value.userId != userId;
    
      });
    }
    removeUserFromArrayByUserName(array:any, userName:string){
      return array.filter(function(value){
        
        return value.userName != userName;
    
      });
    }

}