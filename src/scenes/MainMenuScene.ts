import Phaser from "phaser";
import { C } from "../C";

export class MainMenuScene extends Phaser.Scene {
    Title:Phaser.GameObjects.Text;
    StartButton:Phaser.GameObjects.Container;
    EraseButton:Phaser.GameObjects.Container;

    PointerOffset:{x:number, y:number};
    cursor:Phaser.GameObjects.Image;

    create() {
        if(C.gd == null) {
            C.gd = JSON.parse(localStorage.getItem(C.GAME_NAME));

        }

        this.Title = this.add.text(120,30, 'GAME TITLE').setFontSize(16).setWordWrapWidth(240).setOrigin(.5,0);

        this.StartButton = this.CreateButton('Start Game', this.StartGame).setPosition(30,50);
        this.EraseButton = this.CreateButton('Erase Saved Data', this.EraseSaves).setPosition(200,200);

        let s = this.add.sprite(100,100,'atlas').play('ninja_run_o');

        this.input.on('pointerdown', (pointer) => {
            if (!this.input.mouse.locked)
            {
                this.PointerOffset.x += pointer.x;
                this.PointerOffset.y += pointer.y;
            }
    
            this.input.mouse.requestPointerLock();
    
    
        }, this);
    
        // When locked, you will have to use the movementX and movementY properties of the pointer
        // (since a locked cursor's xy position does not update)
        this.input.on('pointermove', (pointer) => {
    
            if (this.input.mouse.locked)
            {
                this.PointerOffset.x += Math.floor(pointer.movementX * C.MOUSE_SENSITIVITY);
                this.PointerOffset.x = Phaser.Math.Clamp(this.PointerOffset.x, 0, C.GAME_WIDTH);
                this.PointerOffset.y += Math.floor(pointer.movementY * C.MOUSE_SENSITIVITY);
                this.PointerOffset.y = Phaser.Math.Clamp(this.PointerOffset.y, 0, C.GAME_WIDTH);
                // this.l.setPosition(this.PointerOffset.x, this.PointerOffset.y);
                this.cursor.setPosition(this.PointerOffset.x, this.PointerOffset.y);
    
    
            }
        }, this);
    


    }

    StartGame(p:Phaser.Input.Pointer, localx:number, localy:number, event:Phaser.Types.Input.EventData) {
        console.log('Start Button pressed');
        this.input.removeAllListeners();
        this.cameras.main.fadeOut(1000, 0,0,0);
        this.cameras.main.once('camerafadeoutcomplete', () =>{ this.scene.start('game');})
    }

    EraseSaves(p:Phaser.Input.Pointer, localx:number, localy:number, event:Phaser.Types.Input.EventData) {
        console.log('Erase Saved Data Button Pressed');
        localStorage.setItem(C.GAME_NAME, JSON.stringify(C.gd));
    }

    update(time:number, dt:number) {

    }

    CreateButton(text:string, callback:any):Phaser.GameObjects.Container {
        let c = this.add.container();
        let t = this.add.text(0,0,text).setInteractive();
        t.on('pointerdown', callback, this);
        c.add(t);
        return c;
    }
}