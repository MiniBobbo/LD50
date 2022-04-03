import { FSM } from "../FSM/FSM";
import { IH } from "../IH/IH";
import { GameScene } from "../scenes/GameScene";
import { NothingFSM } from "../FSM/NothingFSM";

export class Entity {
    sprite:Phaser.Physics.Arcade.Sprite;
    scene:Phaser.Scene;
    lastAnim!:string;
    fsm:FSM;
    ih:IH;
    gs:GameScene;

    constructor(scene:Phaser.Scene, ih:IH) {
        this.gs = scene as GameScene;
        this.sprite = scene.physics.add.sprite(0,0, 'atlas')
        this.sprite.setSize(16,16);
        this.scene = scene;
        this.sprite.name = '';
        this.sprite.setDepth(50);
        this.fsm = new FSM(this);
        this.fsm.addModule('nothing', new NothingFSM(this));
        this.ih = ih;

        this.sprite.on('dead', this.Dead, this);

        this.scene.events.on('update',this.Update, this)
        this.scene.events.on('travel',() => {this.fsm.clearModule();}, this);
    }

    dispose() {
        this.scene.events.removeListener('update',this.Update, this)
        this.scene.events.removeListener('travel',() => {this.fsm.clearModule();}, this);
    }

    Update(time:number, dt:number) {
        this.fsm.update(time, dt);
    }

    changeFSM(nextFSM:string) {
        this.fsm.changeModule(nextFSM);
    }

    /**
     * Helper Function.  Passes along the emit to the sprite who is actually registered with the event system.
     * @param event 
     * @param args 
     */
    emit(event:string, args?:any[]) {
        this.sprite.emit(event, args);
    }

    PlayAnimation(anim:string, ignoreIfPlaying:boolean = true) {
        let combinedAnim = `${this.sprite.name}_${anim}`;
        if(ignoreIfPlaying && combinedAnim == this.lastAnim)
            return;
        console.log(`Playing ${combinedAnim}`);
        this.sprite.anims.play(combinedAnim, ignoreIfPlaying);
        this.sprite.setOffset(this.sprite.width/2 - this.sprite.body.width/2, this.sprite.height/2- this.sprite.body.height/2);
        this.lastAnim = combinedAnim;
    }

    Dead() {
        // console.log(`${this.sprite.name} dead`);
        this.sprite.body.enable = false;
        this.sprite.setVisible(false);
        this.fsm.changeModule('nothing');
    }
}