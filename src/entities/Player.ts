import { Entity } from "./Entity";
import { IH } from "../IH/IH";
import { C } from "../C";
import { NinjaFSM } from "../FSM/NinjaFSM";
import { NinjaAppearFSM } from "../FSM/NinjaAppearFSM";
import { CustomEvents } from "../enum/CustomEvents";
import { textChangeRangeIsUnchanged } from "typescript";
import { dir } from "console";
import { Dir } from "fs";
import { D } from "../enum/Direction";
import { SFX, SM } from "../SM";

export class Player extends Entity {

    constructor(scene:Phaser.Scene, ih:IH) {
        super(scene, ih);
        // this.gs.collideMap.push(this.sprite);
        this.sprite.setSize(12,14).setDepth(100);
        // this.sprite.setOffset(1,0);
        this.sprite.name = 'ninja';
        this.sprite.setGravityY(C.GRAVITY);
        // this.sprite.setDepth(5);
        this.PlayAnimation('run');
        this.fsm.addModule('ninja', new NinjaFSM(this));
        this.fsm.addModule('appear', new NinjaAppearFSM(this));

        this.gs.events.on(CustomEvents.LEVEL_COMPLETE, this.Disappear, this);
        this.gs.events.on(CustomEvents.PLAYER_DIED, this.NinjaLoss, this);
        this.gs.events.on(CustomEvents.PLAYER_HIT_SPIKES, () => {
            if(this.fsm.currentModuleName == 'ninja') {
                let f = this.fsm.currentModule as NinjaFSM;
                if(f.dir != D.D) {
                    SM.PlaySFX(SFX.Slice);
                    this.gs.events.emit(CustomEvents.PLAYER_DIED);
        
                }
            }
        }, this);



        this.fsm.changeModule('appear');
    }

    Disappear() {
        this.Dead();
        let s = this.gs.add.sprite(this.sprite.body.x + 6, this.sprite.body.y + 7, 'atlas', 'ninja_disappear_0').setDepth(100);
        s.play('ninja_disappear');
        this.gs.realLayer.add(s);
        this.gs.time.addEvent({
            delay:500,
            callbackScope:this,
            callback:() => {
                s.setVisible(false);
                let poof = this.gs.add.sprite(s.x, s.y, 'atlas', 'poof_0').setDepth(100);
                this.gs.realLayer.add(poof);
                poof.play('effect_poof');
            }

        });
    }

    NinjaLoss() {
        this.Dead();
        let spin = this.gs.physics.add.image(this.sprite.body.x, this.sprite.body.y, 'atlas', 'ninja_dead_0').setDepth(51).setOffset(16,16);
        this.gs.realLayer.add(spin);
        this.gs.events.on('update', () => {spin.angle += 5;});
        spin.setGravityY(C.GRAVITY)
        .setVelocity(Phaser.Math.Between(-10,10), -150);
    }

    Update(time:number, dt:number) {
        super.Update(time, dt);
    }


}