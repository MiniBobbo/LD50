import { CustomEvents } from "./enum/CustomEvents";
import { FieldDefIdentifier, LDtkMapPack, LevelFieldIdentifier } from "./map/LDtkReader";
import { GameScene } from "./scenes/GameScene";

export class WinConditions {
    gs:GameScene;
    TouchFlagRequired = false;
    touchingFlag:boolean = false;
    TouchSuppliesRequired = false;
    touchingSupplies:boolean = false;
    GoalText:string;
    SoldiersKilled:number = 0;
    SoldiersKilledRequired:number = 0;



    constructor(gs:GameScene, level:LDtkMapPack) {
        if(level.settings != null) {
            level.settings.forEach(element => {
                switch (element.__identifier) {
                    case LevelFieldIdentifier.Flag:
                        //@ts-ignore
                        this.TouchFlagRequired = element.__value as boolean;
                        break;
                    case LevelFieldIdentifier.Supplies:
                        //@ts-ignore
                        this.TouchSuppliesRequired = element.__value as boolean;
                        break;
                    case LevelFieldIdentifier.Level_Goal:
                        //@ts-ignore
                        this.GoalText = element.__value as string;
                        break;
                    case LevelFieldIdentifier.Kill_Soldiers:
                        //@ts-ignore
                        this.SoldiersKilledRequired = element.__value as number;
                    break;

                    default:
                        break;
                }
            });
        }
        gs.events.on(CustomEvents.PLAYER_HIT_FLAG, () => {this.touchingFlag = true;}, this);
        gs.events.on(CustomEvents.PLAYER_HIT_SUPPLIES, () => {this.touchingSupplies = true;}, this);
        gs.events.on(CustomEvents.PLAYER_HIT_SOLDIER, () => {this.SoldiersKilled++;}, this);
    }


    CheckVictory() {
        if(this.TouchFlagRequired && !this.touchingFlag)
        return false;
        if(this.TouchSuppliesRequired && !this.touchingSupplies)
        return false;
        if(this.SoldiersKilled < this.SoldiersKilledRequired)
        return false;

        return true;
    }

    update() {
        this.touchingFlag = false;
    }

    dispose() {

    }
}