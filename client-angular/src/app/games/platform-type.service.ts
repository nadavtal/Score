import { QueryService } from '../shared/services/query.service'
import { Injectable } from '@angular/core'

@Injectable({providedIn: 'root'})
export class PlatformTypeService {

  constructor(private query:QueryService){}

  addPlatformTypeToDB(platformType){
      console.log(platformType)
      return this.query.post('platformTypes', platformType)
    }
        
      
  

  getAllPlatformTypes(){
    return this.query.get('platformTypes/')
  }

  getOnePlatformType(platformTypeId){
    return this.query.get('platformTypes/'+platformTypeId)
  }

  checkIfPlatformTypeExists(platformType){
    var promise = new Promise((resolve, reject)=> {
      var platformTypetoUpaload = platformType
      this.getOnePlatformType(platformType.name)
      .subscribe((platformType:any) => {
        // console.log(platformType)
        if(platformType.data.name){
          console.log('inDB')
          resolve(false)
        } else{
          resolve(platformTypetoUpaload)
        }
      })
    })
    
    return promise  
  }
}