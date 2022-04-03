import { CustomEvents } from "./enum/CustomEvents";
import { FieldDefIdentifier, LDtkMapPack, LevelFieldIdentifier } from "./map/LDtkReader";
import { GameScene } from "./scenes/GameScene";

export class WinConditions {
    gs:GameScene;
    TouchFlagRequired = false;
    touchingFlag:boolean = false;
    GoalText:string;



    constructor(gs:GameScene, level:LDtkMapPack) {
        if(level.settings != null) {
            level.settings.forEach(element => {
                switch (element.__identifier) {
                    case LevelFieldIdentifier.Flag:
                        //@ts-ignore
                        this.TouchFlagRequired = element.__value as boolean;
                        break;
                    case LevelFieldIdentifier.Level_Goal:
                        //@ts-ignore
                        this.GoalText = element.__value as string;
                        break;
                
                    default:
                        break;
                }
            });
        }
        gs.events.on(CustomEvents.PLAYER_HIT_FLAG, () => {this.touchingFlag = true;}, this);
    }


    CheckVictory() {
        if(this.TouchFlagRequired && !this.touchingFlag)
        return false;

        return true;
    }

    update() {
        this.touchingFlag = false;
    }

    dispose() {

    }
}