export class GameData {
    Times:Array<LevelTimes>;
    constructor() {
        this.Times = [];
    }

    CheckTimeForRecord() {
        return true;
    }

}

export class LevelTimes {
    LevelName:string;
    Time:number;
}