import { D } from "../enum/Direction";
import { GameScene } from "../scenes/GameScene";
import { Entity } from "./Entity";

export class Thrower extends Entity {
    gs!:GameScene;
    constructor(gs:GameScene) {
        super(gs, gs.ih);
        this.gs = gs;
        this.sprite.name = 'thrower';
        this.sprite.setCircle(8);
        this.sprite.visible = false;
    }

    ArmThrower(direction:D, velocity:number, delay:number, offset:number) {
        this.scene.time.addEvent({
            callback:() => {
                let a = this.gs.GetEnemyAttack();
                
                a.sprite.setPosition(this.sprite.x, this.sprite.y);
                a.sprite.angle = 180;
                this.scene.physics.velocityFromAngle(direction, velocity, a.sprite.body.velocity);

            },
            callbackScope:this,
            loop:true,
            delay:delay,
            startAt:offset           
        });

    }
}