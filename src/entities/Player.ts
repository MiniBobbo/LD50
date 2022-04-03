import { Entity } from "./Entity";
import { IH } from "../IH/IH";
import { C } from "../C";
import { NinjaSurface } from "../FSM/NinjaSurface";
import { NinjaJump } from "../FSM/NinjaJump";
import { NinjaFSM } from "../FSM/NinjaFSM";

export class Player extends Entity {

    constructor(scene:Phaser.Scene, ih:IH) {
        super(scene, ih);
        // this.gs.collideMap.push(this.sprite);
        this.sprite.setSize(12,14);
        // this.sprite.setOffset(1,0);
        this.sprite.name = 'ninja';
        this.sprite.setGravityY(C.GRAVITY);
        // this.sprite.setDepth(5);
        this.PlayAnimation('run');
        this.fsm.addModule('ninja', new NinjaFSM(this));


        this.fsm.changeModule('ninja');
    }

    Update(time:number, dt:number) {
        super.Update(time, dt);
    }


}