import { C } from "../C";
import { CustomEvents } from "../enum/CustomEvents";
import { IH } from "../IH/IH";
import { SFX, SM } from "../SM";
import { Entity } from "./Entity";

export class Soldier extends Entity {
    constructor(scene:Phaser.Scene, ih:IH) {
        super(scene, ih);
        // this.gs.collideMap.push(this.sprite);
        this.sprite.setSize(12,14);
        // this.sprite.setOffset(1,0);
        this.sprite.name = 'soldier';
        this.sprite.setGravityY(C.GRAVITY);
        // this.sprite.setDepth(5);
        this.PlayAnimation('stand');

        this.gs.collidePlayer.add(this.sprite);
        this.gs.collideMap.push(this.sprite);

        this.sprite.on(CustomEvents.HIT_PLAYER, () => {
            this.gs.events.emit(CustomEvents.PLAYER_HIT_SOLDIER);
            this.gs.events.emit(CustomEvents.CHECK_LEVEL_COMPLETE);
            this.Dead();
            this.sprite.setVisible(true);
            SM.PlaySFX(SFX.Slice);
            this.PlayAnimation('dead');
        });

    }

    Update(time:number, dt:number) {
        super.Update(time, dt);
    }

}