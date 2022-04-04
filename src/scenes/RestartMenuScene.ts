import { C } from "../C";
import { GameScene } from "./GameScene";
import { MainMenuScene } from "./MainMenuScene";

export class RestartMenuScene extends Phaser.Scene {
    count = 0;
    create() {
        this.scene.remove('menu');
        this.time.addEvent({
            delay:100,
            callbackScope:this,
            callback: () => {
                this.scene.add('menu', MainMenuScene, false);
                this.scene.start('menu');
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