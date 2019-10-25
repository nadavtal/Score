import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sumUnreadMessages"
})
export class UnreadMessages implements PipeTransform  {
  transform(array: any, field: string): number {
    var numUnread = 0
    if (!Array.isArray(array)) {
      return;
    }
    if(!array[0][field]){
        return 
    }
    for(var i=0; i<array.length; i++){
      if(array[field] == 'unread'){
        numUnread++
      }
    }
    
    return numUnread;
  }
  
}