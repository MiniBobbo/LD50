import { CustomEvents } from "../enum/CustomEvents";
import { GameScene } from "../scenes/GameScene";
import { SFX, SM } from "../SM";
import { Entity } from "./Entity";

export class Demon extends Entity {
    killed:boolean = false;
    gs!:GameScene;
    acceleration:number = 300;
    maxspeed:number = 200;
    levelStart:boolean = false;
    constructor(gs:GameScene) {
        super(gs,gs.ih);
        this.gs = gs;
        this.sprite.name = 'demon';
        this.sprite.setScale(.5,.5);
        this.PlayAnimation('fire');
        this.sprite.setCircle(15);
        this.sprite.setOffset(10,40);
        
        this.gs.events.once(CustomEvents.LEVEL_START, () => {this.levelStart = true;}, this);

        this.gs.collidePlayer.add(this.sprite);
        this.sprite.on(CustomEvents.HIT_PLAYER, () => {
            SM.PlaySFX(SFX.Slice);
            this.gs.events.emit(CustomEvents.PLAYER_DIED);
        });

        // this.scene.events.on('update', this.Update, this);
        // this.sprite.on('destroy', this.Destroy, this);
        this.gs.events.on('update', this.Update,this);
        this.sprite.on('destroy', () => { this.gs.events.removeListener('update', this.Update,this);
    },this);
    }

    Update() {
        if(this.levelStart) {
            this.scene.physics.accelerateToObject(this.sprite, this.gs.p.sprite,this.acceleration, this.maxspeed, this.maxspeed);
            // this.sprite.angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(this.sprite, this.gs.p.sprite)); 
        }
    }
}