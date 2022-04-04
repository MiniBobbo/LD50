import { C } from "../C";
import { GameScene } from "./GameScene";

export class RestartScene extends Phaser.Scene {
    count = 0;
    create() {
        this.scene.remove('game');
        this.time.addEvent({
            delay:100,
            callbackScope:this,
            callback: () => {
                this.scene.add('game', GameScene, false);
                this.scene.start('game', {levelName:C.currentLevel});
            }

        });
    }

    // create() {
    //     if(this.scene.get('game')!= null)
    //         this.scene.remove('game');

    //     this.count = 0;
    //     console.log('Restart Scene started');
    // }

    update() {
        // this.count++;
        // if(this.count > 1000) {
        //     this.scene.add('game', GameScene);
        //     this.scene.start('game', {levelName:C.currentLevel});

        // }
    }
}