import { IH } from "../IH/IH";
import { C } from "../C";
import { EnemyFactory } from "../EnemyFactory";
import { Entity } from "../entities/Entity";
import { Player } from "../entities/Player";
import { LDtkMapPack, LdtkReader } from "../map/LDtkReader";

export class GameScene extends Phaser.Scene {
    ih!:IH;
    realLayer:Phaser.GameObjects.Layer;
    outlineLayer:Phaser.GameObjects.Layer;
    realMask:Phaser.GameObjects.RenderTexture;
    LightObjects:Phaser.GameObjects.Container;
    PointerOffset:{x:number, y:number};
    cursor:Phaser.GameObjects.Image;
    
    initRun:boolean = false;

    l:Phaser.GameObjects.Image;
    g:Phaser.GameObjects.Group;


    preload() {
        this.ih = new IH(this);

    }

    init() {
        this.initRun = true;
    }

    create() {
        if(!this.initRun) {
            this.init();
        }
        this.CreateBaseObjects();

    // Pointer lock will only work after an 'engagement gesture', e.g. mousedown, keypress, etc.
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






        // let r:LdtkReader = new LdtkReader(this,this.cache.json.get('level_0'));

        this.add.image(0,0,'solidts');

        // r.CreateAutoLayer('MG', );
        
        // this.add.image(0,0,'mapts');

        // l.setCollision([1,2]);
        // l.renderDebug(g);
        // this.add.image(0,0, 'atlas');
        
        // this.e = new Player(this, this.ih);
        // this.e.sprite.setFrame("player_jumpdown_1");
        // this.cameras.main.startFollow(this.e.sprite);
        // this.cameras.main.setBounds(0,0,belowLayer.width, belowLayer.height);
        // this.physics.add.collider(this.collideMap, belowLayer);
        // this.physics.add.overlap(this.e.sprite, this.zones, (sprite:Phaser.Physics.Arcade.Sprite, z:Phaser.GameObjects.Zone) => {
        //     z.emit('overlap', sprite);
            // console.log(`Hit zone ${z.name}`);
        // });

        // this.physics.add.overlap(this.e.sprite, this.enemies, (p:any, e:any) => {
        //     e.emit('hitplayer', p);
        // }); 

        // this.effects = this.add.group({
        //     classType:Phaser.GameObjects.Sprite
        // });
        
        // let prop = this.map.properties as Array<{name:string, type:string, value:any}>;
        // let ambient = prop.find((e:any) =>{return e.name == 'ambient'});

        // let hb = new HealthBar(this);
        // hb.setDepth(100);

        // this.events.on('effect', this.Effect, this);
        // this.e.sprite.on('dead', this.PlayerDied, this);
        // this.events.on('message', (message:string, x:number, y:number, width:number) => {this.messageText.setPosition(Math.floor(x),Math.floor(y));  this.messageText.message = message; this.messageText.setAlpha(1);}, this);
        // this.events.on('shutdown', this.ShutDown, this);
        // // this.events.on('debug', (message:string) => {this.debugText.text += message + '\n';}, this);
        // this.events.on('travel', () => { this.e.fsm.clearModule(); this.cameras.main.fadeOut(200, 0,0,0,(cam:any, progress:number) => { if(progress == 1) this.scene.restart();}); }, this);
        // this.events.on('textbox', (speaker:{x:number, y:number}, message:string) => {
        //     this.tb.setVisible(true);
        //     this.tb.SetText(message); 
        //     this.tb.MoveAbove(speaker); 
        // }, this);
        // this.events.on('hidetextbox', ()=> {this.tb.setVisible(false);}, this);
        // this.input.on('pointerup', (pointer:any) => {
        //     },this);
        // this.CreateZones();

        // if(C.previouslevel == 'checkpoint') {
        //     let c:any = this.map.objects[0].objects.find((o)=> {return o.name == 'checkpoint';});
        //     c.y -= 16;
        //     this.e.sprite.setPosition(c.x,c.y);
        // } else {
        //     let c:any = this.map.objects[0].objects.find((o)=> {return o.name == 'd' && o.type == C.previouslevel;});
        //     // c.y -= 16;
        //     this.e.sprite.setPosition(c.x,c.y);

        // }

        // this.tb = new TextBox(this, this.ih);
        // this.tb.setVisible(false);
        this.cameras.main.setRoundPixels(true);
        this.cameras.main.fadeIn(300);

        }

    private CreateBaseObjects() {
        this.PointerOffset = { x: 0, y: 0 };
        this.realLayer = this.add.layer().setDepth(100);
        this.outlineLayer = this.add.layer().setDepth(50);
        this.realMask = this.add.renderTexture(0, 0, 250, 250);
        this.LightObjects = this.add.container(0, 0).setVisible(false);

        this.cursor = this.add.image(125, 125, 'atlas', C.cursorFrame).setDepth(1000).setScrollFactor(0, 0);

        this.realLayer.add(this.add.image(0, 0, 'mockup_0').setOrigin(0, 0));
        this.outlineLayer.add(this.add.image(0, 0, 'mockup_1').setOrigin(0, 0));
        this.realLayer.mask = new Phaser.Display.Masks.BitmapMask(this, this.LightObjects);

        // this.LightObjects.add(this.l);
    }

    /**
     * remove the listeners of all the events creted in create() or they will fire multiple times.  
     */
    ShutDown() {
        this.events.removeListener('shutdown');
        this.events.removeListener('debug');
        this.events.removeListener('travel');
        this.events.removeListener('effect');
        this.events.removeListener('pointerup');
    }

    // Effect(data:{name:string, x:number, y:number}) {
    //     let e:Phaser.GameObjects.Sprite = this.effects.getFirstDead(true, 100,100,'atlas');
    //     e.setActive(true);
    //     e.setDepth(55);
    //     e.visible = true;
    //     switch (data.name) {
    //         default:
    //             break;
    //     }

    // }

    update(time:number, dt:number) {
        this.ih.update();

        this.realMask.clear();
        // this.realMask.fill(0x000000);
        
        this.realMask.draw(this.l);

        if(this.ih.IsJustPressed('event')) {
            // this.events.emit('unlock');
        }

        // this.events.emit('debug', `Effects: ${this.effects.getLength()}`);
        // this.events.emit('debug', `P loc: ${Math.floor(this.e.sprite.body.x)},  ${Math.floor(this.e.sprite.body.y)}`);
        // this.events.emit('debug', `Mouse loc: ${Math.floor(this.input.mousePointer.worldX)},  ${Math.floor(this.input.mousePointer.worldY)}`);

    }

    CreateZones() {
        // this.map.objects[0].objects.forEach((o)=> {
        //     switch (o.name) {
        //         case 'travel':
        //             let travel = new TravelZone(this, o);
        //             this.zones.push(travel);
        //             break;
        //         case 'message':
        //             let message = new MessageZone(this, o);
        //             this.zones.push(message);
        //             break;
        //         case 'damage':
        //             let dz = new DamageZone(this, o);
        //             this.zones.push(dz);
        //             break;
        //         case 'powerup':
        //             let puz = new PowerupZone(this, o);
        //             this.zones.push(puz);
        //             break;
        //         case 'enemy':
        //             EnemyFactory.CreateEnemy(this, this.ih, o);
        //         break;
        //         case 'cutscene':
        //             let c= new CutsceneZone(this, o);
        //             this.zones.push(c);
        //         break;
        //         default:
        //             break;
        //     }
        // });
    }

    GetEnemyAttack():any {
        // let a = this.enemyAttacks.find( (a:BaseAttack) => { return a.sprite.body.enable === false;})
        // if(a===undefined) {
        //     a = new BaseAttack(this);
        //     this.enemyAttacks.push(a);
        // }
        // return a;
    }
        
    GetPlayerAttack(type:string):any {
        // let a = this.playerAttacks.find( (a:Phaser.Physics.Arcade.Sprite) => { return a.body.enable === false && a.name === type;})
        // if(a===undefined) {
        //     a = new BaseAttack(this);
        //     this.playerAttacks.push(a);
        //     this.playerAttackSprites.push(a.sprite)
        // }
        // return a;
    }

    PlayerDied() {

    }
        
}