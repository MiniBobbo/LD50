import { Time } from "phaser";

export class GameData {
    Times:Map<string,number>;
    constructor() {
        this.Times = new Map<string, number>();
    }

    CheckTimeForRecord(name:string, time:number):boolean {
        if(!this.Times.has(name) || time < this.Times.get(name)) {
            this.Times.set(name, time);
            return true;
        }
        return false;
    }

    GetTime(name:string) {
        if(!this.Times.has(name))
            return -1;
        return this.Times.get(name);
    }
}

// export class LevelTimes {
//     LevelName:string;
//     Time:number;
// }