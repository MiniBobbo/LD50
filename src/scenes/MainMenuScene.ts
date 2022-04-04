import Phaser from "phaser";
import { getAllJSDocTagsOfKind } from "typescript";
import { C } from "../C";
import { CustomEvents } from "../enum/CustomEvents";
import { GameData } from "../GameData";
import { LdtkReader } from "../map/LDtkReader";
import { Music, SM } from "../SM";
import { GameScene } from "./GameScene";

export class MainMenuScene extends Phaser.Scene {
    Title:Phaser.GameObjects.Text;
    StartButton:Phaser.GameObjects.Container;
    EraseButton:Phaser.GameObjects.Container;

    PointerOffset:{x:number, y:number};
    cursor:Phaser.Physics.Arcade.Image;

    buttons:Phaser.Physics.Arcade.Group;
    bg1:Phaser.GameObjects.TileSprite;
    bg2:Phaser.GameObjects.TileSprite;

    allComplete:boolean;
    TotalTime:number;

    create() {

        SM.Register(this);

        if(SM.currentSong == null) {
            SM.PlayMusic(Music.SLAP_THAT_NINJA);
        }

        this.buttons = this.physics.add.group();

        this.allComplete = true;
        this.TotalTime = 0;

        //Get all the levels:
        let r: LdtkReader = new LdtkReader(this, this.cache.json.get('levels'));
        let allLevels = r.ldtk.levels;
        let levelcount = 0;
        let xpos = 10;
        let ypos = 75;
        allLevels.forEach(element => {
            let lbutton = this.CreateLevelButton(element.fieldInstances.find(e=>e.__identifier == 'Level_Name').__value,
            element.identifier
            );
            lbutton.x = xpos;
            let thisy = levelcount;
            if(thisy > 5)
                thisy = 0;
            lbutton.y = 75 + (thisy*26);
            levelcount++;
            if(levelcount > 5)
                xpos = 150;
            lbutton.setDepth(1000);

        }, this);
        // let level2 = this.CreateLevelButton('Level 1', 'Level_1').setPosition(30, 75);
        // let level1 = this.CreateLevelButton('Level 2', 'Getting_Started').setPosition(30, 95);
        // let level3 = this.CreateLevelButton('Level 3', 'Traps').setPosition(30, 115);
        

        console.log(JSON.stringify(C.gd));

        this.bg2 = this.add.tileSprite(0, 0, 250,250, 'atlas', 'menubg_1').setOrigin(0,0);
        this.bg1 = this.add.tileSprite(0, 0, 250,250, 'atlas', 'menubg_0').setOrigin(0,0);
        let ninja = this.add.sprite(125, 190, 'atlas').play('ninja_run');


        if(this.scene.get('game')!= null)
            this.scene.remove('game');

        this.cursor = this.physics.add.image(125, 125, 'atlas', C.cursorFrame).setDepth(1000).setScrollFactor(0, 0).setSize(2,2);

        this.PointerOffset = {x:0, y:0};

        // this.Title = this.add.text(120,30, 'Revenge is Inevitable').setFontSize(16).setWordWrapWidth(240).setOrigin(.5,0);
        let title = this.add.text(0,35,'Revenge is Inevitable', {align:'center', fontFamily: '"Yeon Sung", "Arial"'})
        .setFixedSize(250,0).setDepth(500).setStroke('0#000', 3)
        .setFontSize(26).setWordWrapWidth(250);
        if(this.allComplete) {
            let finished = this.add.text(0,18,`Completion Time: ${(this.TotalTime/1000).toFixed(2)} seconds`, {align:'center', fontFamily: '"Yeon Sung", "Arial"'})
            .setFixedSize(250,0).setDepth(500).setStroke('0#000', 3).setTint(0xff0000)
            .setFontSize(15).setWordWrapWidth(250);
    
        }
        // this.StartButton = this.CreateButton('Level 0', this.StartGame).setPosition(30,50);
        // this.EraseButton = this.CreateButton('Erase Times\n(Careful)', this.EraseSaves, 8).setPosition(200,0);
        this.EraseButton = this.CreateButton('Change Music', this.CycleMusic, 10).setPosition(5,0);


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
        this.bg1.tilePositionX += 5;
        this.bg2.tilePositionX += 3;
    }

    CreateButton(text:string, callback:any, textSize:number = 12):Phaser.GameObjects.Container {
        let c = this.add.container();
        let t = this.add.text(0,0,text, {fontFamily: '"Yeon Sung", "Arial"'}).setFontSize(textSize).setInteractive().setStroke('0#000', 3);
        t.on(CustomEvents.BUTTON_CLICKED, callback, this);
        c.add(t);
        this.buttons.add(t);
        return c;
    }

    CreateLevelButton(levelName:string, levelID:string, width:number = 50, height:number = 50):Phaser.GameObjects.Container {
        let c = this.add.container().setSize(width, height);
        let t = this.add.text(0,0,levelName, {fontFamily: '"Yeon Sung", "Arial"'}).setInteractive().setStroke('0#000', 3).setFontSize(14).setTint(0xffffff);
        t.once(CustomEvents.BUTTON_CLICKED, () => {
            this.scene.add('game', GameScene);
            this.scene.start('game', {levelName:levelID});

        }, this);
        c.add(t);
        let leveltime = C.gd.GetTime(levelID);
        let time = this.add.text(0,14,'Best Time ', {fontFamily: '"Yeon Sung", "Arial"'}).setInteractive().setStroke('0#000', 3).setFontSize(10).setTint(0x8888ff);
        if(leveltime == -1) {
            time.text += '---';
            this.allComplete = false;
        }
        else {
            time.text += (leveltime/1000).toFixed(2);
            this.TotalTime += leveltime;

        }

        t.once(CustomEvents.BUTTON_CLICKED, () => {
            this.scene.add('game', GameScene);
            this.scene.start('game', {levelName:levelID});
        }, this);
        c.add(time);
        this.buttons.add(t);
        return c;
    }

}