import { C } from "../C";
import { CustomEvents } from "../enum/CustomEvents";
import { IH } from "../IH/IH";
import { SFX, SM } from "../SM";
import { Entity } from "./Entity";

export class Spike extends Entity {
    constructor(scene:Phaser.Scene, ih:IH) {
        super(scene, ih);
        this.sprite.setSize(20,10);
        // this.sprite.setOffset(1,0);
        this.sprite.name = 'spike';
        this.sprite.setFrame('spikes_0');
        this.sprite.setOffset(1,0);
        
        // this.sprite.setGravityY(C.GRAVITY);
        // this.sprite.setDepth(5);
        // this.PlayAnimation('wave');
        this.gs.collidePlayer.add(this.sprite);
        this.sprite.on(CustomEvents.HIT_PLAYER, () => {
            // SM.PlaySFX(SFX.Slice);
            this.gs.events.emit(CustomEvents.PLAYER_HIT_SPIKES);
        });
        this.gs.collideMap.push(this.sprite);
        // this.gs.realLayer.add(this.sprite);
    }

    Update(time:number, dt:number) {
        super.Update(time, dt);
        // this.sprite.angle += 10;
    }

}