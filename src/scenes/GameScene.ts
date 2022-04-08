import { IH } from "../IH/IH";
import { C } from "../C";
import { EnemyFactory } from "../EnemyFactory";
import { Entity } from "../entities/Entity";
import { Player } from "../entities/Player";
import { LDtkMapPack, LdtkReader } from "../map/LDtkReader";
import { MapHelper } from "../helpers/MapHelper";
import { CustomEvents } from "../enum/CustomEvents";
import { WinConditions } from "../WinConditions";
import { Display } from "phaser";
import { GameData } from "../GameData";
import { Powerup } from "../enum/Powerup";
import { NinjaStar } from "../entities/Ninjastar";
import { SFX, SM } from "../SM";

export class GameScene extends Phaser.Scene {
    initRun:boolean = false;

    ih!:IH;
    realLayer:Phaser.GameObjects.Layer;
    // outlineLayer:Phaser.GameObjects.Layer;
    HudLayer:Phaser.GameObjects.Layer;
    // realMask:Phaser.GameObjects.RenderTexture;
    // LightObjects:Phaser.GameObjects.Container;
    PointerOffset:{x:number, y:number};
    cursor:Phaser.GameObjects.Image;

    effects:Phaser.GameObjects.Group;
    attacks:Array<NinjaStar>;


    CurrentPowerup:Powerup;
    PowerupIcon:Phaser.GameObjects.Sprite;

    DisplayText:Phaser.GameObjects.Text;
    Timer:Phaser.GameObjects.Text;
    ElapsedTime:number;
    TimerStart:boolean = false;

    gd:GameData;

    maps:LDtkMapPack;

    // debugText:Phaser.GameObjects.Text;
    debugText:Phaser.GameObjects.BitmapText;
    collideMap!:Array<Phaser.GameObjects.GameObject>;
    collidePlayer!:Phaser.GameObjects.Group;
    collideEntity!:Phaser.Physics.Arcade.Group;
    entities!:Phaser.GameObjects.Group;
    Win:WinConditions;

    //Entity variables 
    p:Player;


    preload() {
        this.ih = new IH(this);

    }

    init() {
        this.initRun = true;
        this.collidePlayer = this.add.group();
        this.collideEntity = this.physics.add.group();
        this.entities = this.add.group();
        // this.collideMap = [];
    }

    create(data:{levelName:string}) {
        if(!this.initRun) {
            this.init();
        }
        this.attacks = [];
        this.CurrentPowerup = Powerup.NONE;
        this.ElapsedTime = 0;
        this.TimerStart = false;

        SM.Register(this);



        C.currentLevel = data.levelName;
        this.collidePlayer.clear();
        this.collideEntity.clear();
        this.entities.clear();
        this.collideMap = [];
        this.CreateBaseObjects();
        this.MouseCapture();
        MapHelper.CreateMap(this, data.levelName);
        C.CurrentCollisionLayer = this.maps.collideLayer;

        this.debugText = this.add.bitmapText(0,0, '6px', '').setDepth(2000).setFontSize(6).setScrollFactor(0);
        // this.debugText = this.add.text(0, 10, 'Debug', {fontFamily: '"Yeon Sung", "Arial"'})
        // .setFixedSize(250,0).setTint(0xffffff).setScrollFactor(0,0)
        // .setFontSize(12).setWordWrapWidth(250).setOrigin(0,0);
        this.DisplayText = this.add.text(0, 100, 'Ready...', {align:'center', fontFamily: '"Yeon Sung", "Arial"'})        
        .setFixedSize(250,0).setTint(0xffffff).setScrollFactor(0,0)
        .setFontSize(40).setWordWrapWidth(250);
        this.HudLayer.add(this.DisplayText);
        SM.PlaySFX(SFX.Ready);

        this.PowerupIcon = this.add.sprite(230, 20, 'atlas', 'ninjastar_0').setScrollFactor(0,0).setVisible(false);
        this.HudLayer.add(this.PowerupIcon);


        this.CreateListeners();
        this.events.once('shutdown', this.RemoveListeners, this);

        // l.setCollision([1,2]);
        this.cameras.main.startFollow(this.p.sprite);
        this.cameras.main.setBounds(0,0, this.maps.collideLayer.width, this.maps.collideLayer.height);

        this.effects = this.add.group({
            classType:Phaser.GameObjects.Sprite
        });
        
        this.events.on('effect', this.Effect, this);
        this.p.sprite.on(CustomEvents.LEVEL_FAILED, this.PlayerDied, this);

        this.cameras.main.setRoundPixels(true);
        this.cameras.main.fadeIn(300);

        this.tweens.add({
            targets:this.DisplayText,
            alpha:0,
            duration:900,

        });

        this.time.addEvent({
            delay:1000,
            callbackScope:this,
            callback:() => {
                this.events.emit(CustomEvents.LEVEL_START);
                this.DisplayText.setAlpha(1).setText("GO").setTint(0xff0000).setFontSize(50);
                SM.PlaySFX(SFX.Go);
                this.TimerStart = true;
                this.tweens.add({
                    targets:this.DisplayText,
                    alpha:0,
                    duration:400,
        
                });
            }
        });

        this.Timer = this.add.text(0, 230, '0', {fontFamily: '"Yeon Sung", "Arial"'})        
        .setTint(0xffffff).setScrollFactor(0,0).setStroke('0#000', 3)
        .setFontSize(12);
        this.HudLayer.add(this.Timer);
    }
    Effect(arg0: string, Effect: any, arg2: this) {
        throw new Error("Method not implemented.");
    }


    private MouseCapture() {
        this.input.on('pointerdown', (pointer:Phaser.Input.Pointer) => {
            // console.log('GameScene Clicked');
            if (!this.input.mouse.locked) {
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

            if (this.input.mouse.locked) {
                this.PointerOffset.x += Math.floor(pointer.movementX * C.MOUSE_SENSITIVITY);
                this.PointerOffset.x = Phaser.Math.Clamp(this.PointerOffset.x, 0, C.GAME_WIDTH);
                this.PointerOffset.y += Math.floor(pointer.movementY * C.MOUSE_SENSITIVITY);
                this.PointerOffset.y = Phaser.Math.Clamp(this.PointerOffset.y, 0, C.GAME_WIDTH);
                // this.l.setPosition(this.PointerOffset.x, this.PointerOffset.y);
                this.cursor.setPosition(this.PointerOffset.x, this.PointerOffset.y);


            }
        }, this);
    }

    private CreateListeners() {
        this.events.on('debug', (message:string) => {this.debugText.text += message + '\n';}, this);
        this.events.on(CustomEvents.CHECK_LEVEL_COMPLETE, ()=> {if(this.Win.CheckVictory()) this.events.emit(CustomEvents.LEVEL_COMPLETE);});
        this.events.on(CustomEvents.LEVEL_COMPLETE, () => {
            SM.PlaySFX(SFX.Complete);
            let complete = this.add.text(0, 100, 'Complete', {align:'center', fontFamily: '"Yeon Sung", "Arial"'})        
            .setFixedSize(250,0).setTint(0xffffff).setScrollFactor(0,0)
            .setFontSize(40).setWordWrapWidth(250).setStroke('0#000', 3);
            this.HudLayer.add(complete);
            this.TimerStart = false;
            
            if(C.gd.CheckTimeForRecord(C.currentLevel, this.ElapsedTime)) {
                    let complete = this.add.text(0, 145, '*** New Record ***', {align:'center', fontFamily: '"Yeon Sung", "Arial"'})        
                    .setFixedSize(250,0).setTint(0xff0000).setScrollFactor(0,0)
                    .setFontSize(24).setWordWrapWidth(250).setStroke('0#000', 3);
                    this.HudLayer.add(complete);
                } 
        

            this.time.addEvent({
                delay:2000,
                callbackScope:this, 
                callback:() => {this.scene.start('restartmenu');}
            });
        });
        this.events.on(CustomEvents.PLAYER_DIED, this.PlayerDied, this);

        this.events.on(CustomEvents.POWERUP, (p:Powerup) => {
            switch (p) {
                case Powerup.NINJASTARS:
                    this.CurrentPowerup = Powerup.NINJASTARS;
                    this.PowerupIcon.setFrame('ninjastar_0').setVisible(true).setAlpha(.8);
                    break;
            
                default:
                    break;
            }
        });

        this.physics.world.on('tilecollide', (o:Phaser.GameObjects.GameObject) => {
            console.log(`${o.name} hit wall`);
            o.emit('hitwall');
        });


    }

    private RemoveListeners() {
        this.events.removeListener('debug');
        this.events.removeListener(CustomEvents.CHECK_LEVEL_COMPLETE);
        this.events.removeListener(CustomEvents.LEVEL_COMPLETE);

    }


    private CreateBaseObjects() {
        this.PointerOffset = { x: 0, y: 0 };
        this.realLayer = this.add.layer().setDepth(100);
        // this.outlineLayer = this.add.layer().setDepth(50);
        // this.realMask = this.add.renderTexture(0, 0, 250, 250);
        // this.LightObjects = this.add.container(0, 0);
        this.HudLayer = this.add.layer().setDepth(1000);

        //Reset the cursor to the previous position
        this.PointerOffset.x= C.LastCursorPosition.x;
        this.PointerOffset.y = C.LastCursorPosition.y;
        this.cursor = this.add.image(this.PointerOffset.x, this.PointerOffset.y, 'atlas', C.cursorFrame).setDepth(1000).setScrollFactor(0, 0);
        this.HudLayer.add(this.cursor);

        // this.realLayer.add(this.add.image(0, 0, 'mockup_0').setOrigin(0, 0));
        // this.outlineLayer.add(this.add.image(0, 0, 'mockup_1').setOrigin(0, 0));
        // this.realLayer.mask = new Phaser.Display.Masks.BitmapMask(this, this.LightObjects);

    }


    update(time:number, dt:number) {
        this.ih.update();
        this.debugText.text = '';
        this.Win.update();
        this.debugText.text = `Cursor position - X:${this.cursor.x}, Y:${this.cursor.y}\n
        Player position - X:${Math.floor(this.p.sprite.x)}, Y:${Math.floor(this.p.sprite.y)}`;


        if(this.ih.IsJustPressed('menu')) {
            C.LastCursorPosition.x = this.PointerOffset.x;
            C.LastCursorPosition.y = this.PointerOffset.y;
            this.scene.start('restartmenu');
        }
        if(this.ih.IsJustPressed('restart')) {
            C.LastCursorPosition.x = this.PointerOffset.x;
            C.LastCursorPosition.y = this.PointerOffset.y;

            this.scene.start('restart');
        }

        if(this.ih.IsJustPressed('action')) {
            if(this.CurrentPowerup == Powerup.NINJASTARS) {
                let star = this.GetNinjaStar();
                star.setPosition(this.p.sprite.x, this.p.sprite.y).setVisible(true);
                let cpos = {x: this.cameras.main.scrollX + this.cursor.x, y: this.cameras.main.scrollY + this.cursor.y}; 
                let a = Phaser.Math.Angle.BetweenPoints(this.p.sprite, cpos);
                let v = new Phaser.Math.Vector2(C.NINJASTAR_THROW_STRENGTH, 0);
                v.rotate(a);
                star.setVelocity(v.x, v.y);
                star.setGravityY(C.GRAVITY);
        
            }
        }

        if(this.p.sprite.active && this.p.sprite.y > this.maps.collideLayer.height) {
            this.p.sprite.y = this.maps.collideLayer.height;
            this.events.emit(CustomEvents.PLAYER_DIED);
        }

        if(this.TimerStart) {
            this.ElapsedTime += dt;
            this.Timer.text = (this.ElapsedTime/1000).toFixed(2);
        }

        // this.realMask.clear();
        // this.realMask.fill(0x000000);
        
        // this.realMask.draw(this.LightObjects);


        // this.events.emit('debug', `State: ${this.p.fsm.currentModuleName}`);
        // this.events.emit('debug', `P loc: ${Math.floor(this.e.sprite.body.x)},  ${Math.floor(this.e.sprite.body.y)}`);
        // this.events.emit('debug', `Mouse loc: ${Math.floor(this.input.mousePointer.worldX)},  ${Math.floor(this.input.mousePointer.worldY)}`);

    }

    GetEnemyAttack():any {
            let a = this.attacks.find((a:any) => {return !a.alive;});
            if (a==null) {
                a = new NinjaStar(this);
                this.realLayer.add(a.sprite);
            }
            return a;
        }
        
    PlayerDied() {
        SM.PlaySFX(SFX.Disgraced);
        this.DisplayText.setAlpha(1).setText("DISGRACED").setTint(0xffffff).setFontSize(50);

        this.time.addEvent({
            delay:1500,
            callbackScope:this,
            callback:() => {
                C.LastCursorPosition.x = this.PointerOffset.x;
                C.LastCursorPosition.y = this.PointerOffset.y;
    
                this.scene.start('restart');
                this.scene.remove();
        
        }
        });
    }

    GetNinjaStar():Phaser.Physics.Arcade.Sprite {
        let star:Phaser.Physics.Arcade.Sprite = this.collideEntity.getFirstDead(false);
        if(star == null) {
            star = this.physics.add.sprite(-10,-10, 'atlas', 'ninjastar_1').enableBody(true, -10,-10, true, true).setCircle(4).setOffset(6,6).setName('star');
            this.collideEntity.add(star);
            this.realLayer.add(star);
            this.collideMap.push(star);
            star.on('hitwall', () => {star.destroy();});

        }
        
        return star;
    }
        
}