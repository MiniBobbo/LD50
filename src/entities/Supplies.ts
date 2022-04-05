import { C } from "../C";
import { CustomEvents } from "../enum/CustomEvents";
import { IH } from "../IH/IH";
import { SFX, SM } from "../SM";
import { Entity } from "./Entity";

export class Supplies extends Entity {
    constructor(scene:Phaser.Scene, ih:IH) {
        super(scene, ih);
        // this.gs.collideMap.push(this.sprite);
        this.sprite.setSize(50,40);
        this.sprite.setDepth(49);
        // this.sprite.setOffset(1,0);
        this.sprite.name = 'supplies';
        this.sprite.setFrame('supplies_0');
        this.sprite.setOffset(20,20);
        
        this.sprite.setGravityY(C.GRAVITY);
        // this.sprite.setDepth(5);
        
        this.gs.collidePlayer.add(this.sprite);
        this.sprite.on(CustomEvents.HIT_PLAYER, () => {
            console.log('Player hit supplies');
            this.gs.cameras.main.flash(200, 255, 0,0);
            let fire = this.gs.add.sprite(this.sprite.body.x + 18, this.sprite.body.y-4, 'atlas').play('effect_fire').setDepth(49);
            SM.PlaySFX(SFX.Boom);
            this.gs.realLayer.add(fire);
            this.gs.events.emit(CustomEvents.PLAYER_HIT_SUPPLIES);
            this.gs.events.emit(CustomEvents.CHECK_LEVEL_COMPLETE);
        });
        this.gs.events.on(CustomEvents.LEVEL_COMPLETE, () => {
            this.sprite.removeListener(CustomEvents.CHECK_LEVEL_COMPLETE);
        });
        this.gs.collideMap.push(this.sprite);
        // this.gs.realLayer.add(this.sprite);
    }

    Update(time:number, dt:number) {
        super.Update(time, dt);
    }

    dispose(): void {

        super.dispose();
    }

}