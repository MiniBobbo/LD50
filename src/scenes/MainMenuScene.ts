import Phaser from "phaser";
import { C } from "../C";
import { CustomEvents } from "../enum/CustomEvents";
import { Music, SM } from "../SM";
import { GameScene } from "./GameScene";

export class MainMenuScene extends Phaser.Scene {
    Title:Phaser.GameObjects.Text;
    StartButton:Phaser.GameObjects.Container;
    EraseButton:Phaser.GameObjects.Container;

    PointerOffset:{x:number, y:number};
    cursor:Phaser.Physics.Arcade.Image;

    buttons:Phaser.Physics.Arcade.Group;

    create() {
        if(C.gd == null) {
            C.gd = JSON.parse(localStorage.getItem(C.GAME_NAME));
        }

        SM.Register(this);

        if(SM.currentSong == null) {
            SM.PlayMusic(Music.SLAP_THAT_NINJA);
        }


        if(this.scene.get('game')!= null)
            this.scene.remove('game');

        this.buttons = this.physics.add.group();
        this.cursor = this.physics.add.image(125, 125, 'atlas', C.cursorFrame).setDepth(1000).setScrollFactor(0, 0).setSize(2,2);

        this.PointerOffset = {x:0, y:0};

        this.Title = this.add.text(120,30, 'Revenge is Inevitable').setFontSize(16).setWordWrapWidth(240).setOrigin(.5,0);

        // this.StartButton = this.CreateButton('Level 0', this.StartGame).setPosition(30,50);
        // this.EraseButton = this.CreateButton('Erase Saved Data', this.EraseSaves).setPosition(200,200);
        this.EraseButton = this.CreateButton('Change\nMusic', this.CycleMusic, 10).setPosition(200,220);

        let level1 = this.CreateLevelButton('Level 2', 'Kill_The_Sentry').setPosition(30, 95);
        let level2 = this.CreateLevelButton('Level 1', 'Level_1').setPosition(30, 75);

        // let s = this.add.sprite(100,100,'atlas').play('ninja_jump_up');

        this.input.on('pointerdown', (pointer) => {
            if (!this.input.mouse.locked)
            {
                this.PointerOffset.x += pointer.x;
                this.PointerOffset.y += pointer.y;
                this.input.mouse.requestPointerLock();
            } else {
                this.events.emit(CustomEvents.PLAYER_CLICKED, pointer);
            }
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

        this.events.on(CustomEvents.PLAYER_CLICKED, this.CheckButtons, this);
    }
   
    CheckButtons(PLAYER_CLICKED: CustomEvents, CheckButtons: any, arg2: this) {
        this.physics.overlap(this.cursor, this.buttons, (c:any, b:any) => {
            let button = b as Phaser.GameObjects.Text;
            console.log(`Overlapping ${b.text}`);
            button.emit(CustomEvents.BUTTON_CLICKED);
            });

        // this.buttons.children.iterate(e=>{
        //     let t = e as Phaser.GameObjects.Text;

        // });
    }

    CycleMusic() {
        if(SM.currentSong == Music.Funkjutsu)
            SM.PlayMusic(Music.SLAP_THAT_NINJA);
        else
            SM.PlayMusic(Music.Funkjutsu);

    }

    Dispose() {
        this.events.removeListener(CustomEvents.PLAYER_CLICKED, this.CheckButtons, this);
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

    CreateButton(text:string, callback:any, textSize:number = 12):Phaser.GameObjects.Container {
        let c = this.add.container();
        let t = this.add.text(0,0,text).setFontSize(textSize).setInteractive();
        t.on(CustomEvents.BUTTON_CLICKED, callback, this);
        c.add(t);
        this.buttons.add(t);
        return c;
    }

    CreateLevelButton(levelName:string, levelID:string, width:number = 50, height:number = 50):Phaser.GameObjects.Container {
        let c = this.add.container().setSize(width, height);
        let t = this.add.text(0,0,levelName).setInteractive();
        t.once(CustomEvents.BUTTON_CLICKED, () => {
            this.scene.add('game', GameScene);
            this.scene.start('game', {levelName:levelID});

        }, this);
        c.add(t);
        this.buttons.add(t);
        return c;
    }

}