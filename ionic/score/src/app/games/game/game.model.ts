export class Game {
    public id: number;
    public groupName: string;
    public groupManager: string;
    public mainPlatform: string;
    public password: string;
    public groupImage: string;
    public members: [];

    
  
    constructor(id:number, groupName: string, groupManager: string, mainPlatform: string, password: string, groupImage: string, members: []) {
      this.id = id;
      this.groupName = groupName;
      this.groupManager = groupManager;
      this.mainPlatform = mainPlatform;
      this.password = password;
      this.groupImage = groupImage;
      this.members = members;
      
    }
  }