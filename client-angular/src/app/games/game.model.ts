

export class Game {
    public name: string;
    public gameType: string;
    public buyIn: number;
    
    public time: Date;
    public host: string;
    public platform: string;
    public players: [{username: string, userId: string}];
    public playersPerGroup: number;
    public winner: {userName: String, userId: string};
    public gameGroups: [{
      groupNumber: Number,
      groupMembers: [{
        userName: String}],
    }];
    public group: string;
    
  
    constructor(name: string, 
                gameType: string, 
                buyIn: number, 
                winner:  {
                  userName: String, 
                  userId: string
                }, 
                time: Date, 
                host: string, 
                platform: string, 
                players: [{
                  username: string, 
                  userId: string}],
                playersPerGroup: number, 
                gameGroups: [{
                  groupNumber: Number,
                  groupMembers: [{
                    userName: String}],
                }],
                group: string) 
                {
      this.name = name;
      this.gameType = gameType;
      this.buyIn = buyIn;
      this.winner = winner;
      this.time = time;
      this.host = host;
      this.platform = platform;
      this.players = players;
      this.playersPerGroup = playersPerGroup;
      this.gameGroups = gameGroups;
      this.group = group;
      
    }
  }