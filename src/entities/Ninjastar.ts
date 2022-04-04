import { CustomEvents } from "../enum/CustomEvents";
import { IH } from "../IH/IH";
import { SFX, SM } from "../SM";
import { Entity } from "./Entity";

export class NinjaStar extends Entity {
    constructor(scene:Phaser.Scene, ih:IH) {
        super(scene, ih);
        // this.gs.collideMap.push(this.sprite);
        this.sprite.setCircle(30);
        // this.sprite.setOffset(1,0);
        this.sprite.name = 'blade';
        this.sprite.setFrame('blade_0').setOffset(1,1);
        
        // this.sprite.setGravityY(C.GRAVITY);
        // this.sprite.setDepth(5);
        // this.PlayAnimation('wave');
        this.gs.collidePlayer.add(this.sprite);
        this.sprite.on(CustomEvents.HIT_PLAYER, () => {
            SM.PlaySFX(SFX.PowerUp);
            
        });
        this.gs.collideMap.push(this.sprite);
        // this.gs.realLayer.add(this.sprite);
    }

    Update(time:number, dt:number) {
        super.Update(time, dt);
        this.sprite.angle += 5;
    }

}