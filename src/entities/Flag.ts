import { C } from "../C";
import { CustomEvents } from "../enum/CustomEvents";
import { IH } from "../IH/IH";
import { Entity } from "./Entity";

export class Flag extends Entity {
    constructor(scene:Phaser.Scene, ih:IH) {
        super(scene, ih);
        // this.gs.collideMap.push(this.sprite);
        this.sprite.setSize(20,20);
        this.sprite.setDepth(100);
        // this.sprite.setOffset(1,0);
        this.sprite.name = 'flag';
        this.sprite.setGravityY(C.GRAVITY);
        // this.sprite.setDepth(5);
        this.PlayAnimation('wave');
        this.gs.collidePlayer.add(this.sprite);
        this.sprite.on(CustomEvents.HIT_PLAYER, () => {
            console.log('Player hit flag');
            this.gs.events.emit(CustomEvents.PLAYER_HIT_FLAG);
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