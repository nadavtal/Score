

export class User {
    public _id: string;
    public userName: string;
    public firstName: string;
    public surname: string;
    public password: string;
    public email: string;
    public role: string;
    public wins: number;
    public balance: number;
    public gamesHistory: []
    public groups: [];
    public friends: [{
      userName: string,
      userId: string
    }];
    public profileImageFileName: string;
    public profileImageLink: string;
    public accounts: [];
    public messages: [];
    public createdAt: Date;
    public updatedAt: Date;

    
  
    constructor(
                _id:string, 
                userName: string, 
                firstName: string, 
                surname: string, 
                password: string, 
                email: string, 
                role: string,
                wins: number,
                balance: number,
                gamesHistory: [],
                groups: [],
                friends: [{
                  userName: string,
                  userId: string
                }],
                profileImageFileName: string,
                profileImageLink: string,
                accounts: [],
                messages: [],
                createdAt: Date,
                updatedAt: Date
                ) {
      this._id = _id;
      this.userName = userName;
      this.firstName = firstName;
      this.surname = surname;
      this.password = password;
      this.email = email;
      this.role = role;
      this.wins = wins;
      this.balance = balance;
      this.gamesHistory = gamesHistory;
      this.friends = friends;
      this.profileImageFileName = profileImageFileName;
      this.profileImageLink = profileImageLink;
      this.accounts = accounts;
      this.messages = messages;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      
      
    }
  }