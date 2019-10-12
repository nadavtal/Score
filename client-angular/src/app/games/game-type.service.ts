import { QueryService } from '../shared/services/query.service'
import { Injectable } from '@angular/core'

@Injectable({providedIn: 'root'})
export class GameTypeService {

    constructor(private query:QueryService){}

    addGameTypeToDB(gameType){
        console.log(gameType)
        return this.query.post('gameTypes', gameType)
      }
        
      
  

  getAllGameTypes(){
    return this.query.get('gameTypes/')
  }

  getOneGameType(gameTypeId){
    return this.query.get('gameTypes/'+gameTypeId)
  }

  checkIfGameTypeExists(gameType){
    var promise = new Promise((resolve, reject)=> {
      var gameTypetoUpaload = gameType
      this.getOneGameType(gameType.name)
      .subscribe((gameType:any) => {
        // console.log(gameType)
        if(gameType.data.name){
          console.log('inDB')
          resolve(false)
        } else{
          resolve(gameTypetoUpaload)
        }
      })
    })
    
    return promise  
  }
}