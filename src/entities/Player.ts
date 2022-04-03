import { Entity } from "./Entity";
import { IH } from "../IH/IH";
import { C } from "../C";
import { NinjaFSM } from "../FSM/NinjaFSM";
import { NinjaAppearFSM } from "../FSM/NinjaAppearFSM";

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
        this.fsm.addModule('appear', new NinjaAppearFSM(this));


        this.fsm.changeModule('appear');
    }

    Update(time:number, dt:number) {
        super.Update(time, dt);
    }


}