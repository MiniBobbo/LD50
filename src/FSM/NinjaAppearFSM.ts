import { C } from "../C";
import { Player } from "../entities/Player";
import { CustomEvents } from "../enum/CustomEvents";
import { GameScene } from "../scenes/GameScene";
import { FSMModule } from "./FSMModule";

export class NinjaAppearFSM extends FSMModule {
    target:{x:number, y:number};
    p:Player;
    gs:GameScene;


    moduleStart(args: any): void {
        this.p = this.parent as Player;
        this.gs = this.p.gs;

        this.p.PlayAnimation('appear');
        this.p.sprite.setGravity(0, C.GRAVITY);

        this.gs.events.on(CustomEvents.LEVEL_START, this.StartLevel, this);
        

    }
    StartLevel(LEVEL_START: CustomEvents, StartLevel: any, arg2: this) {
        this.parent.changeFSM('ninja');
    }

    update(dt: number): void {
        // if(this.p.sprite.body.blocked.down) {
            // this.p.PlayAnimation('crouch');
            // this.parent.changeFSM('ninja');
        // }

    }
}