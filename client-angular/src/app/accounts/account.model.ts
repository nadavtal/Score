export class Account {
    public id: number;
    public platform: string;
    public userName: string;
    public accountId: string;
    public userId: string;
    

    
  
    constructor(id:number, platform: string, userName: string, accountId: string, userId: string) {
      this.id = id;
      this.platform = platform;
      this.userName = userName;
      this.accountId = accountId;
      this.userId = userId;
      
      
    }
  }