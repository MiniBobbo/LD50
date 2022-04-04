import { C } from "../C";
import { CustomEvents } from "../enum/CustomEvents";
import { D } from "../enum/Direction";
import { IH } from "../IH/IH";
import { SFX, SM } from "../SM";
import { Entity } from "./Entity";

export class Spike extends Entity {
    constructor(scene:Phaser.Scene, ih:IH, direction:D) {
        super(scene, ih);
        if(direction == D.U || direction == D.D)
            this.sprite.setSize(20,10);
        else
            this.sprite.setSize(10,20);

        // this.sprite.setOffset(1,0);
        this.sprite.name = 'spike';
        this.sprite.setFrame('spikes_0');
        this.sprite.setOffset(1,0);
        if(direction == D.L) {
            this.sprite.angle = 90;
            this.sprite.setOffset(4,-5);
        }
        else if(direction == D.R) {
            this.sprite.angle = 270;
            this.sprite.setOffset(6,-5);
        } else if(direction == D.U) {
            this.sprite.angle = 180;
        }   



        
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