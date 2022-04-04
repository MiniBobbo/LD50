import { C } from "../C";
import { GameScene } from "../scenes/GameScene";
import { Blade } from "./Blade";

export class Dropper {
    blade:Blade;
    pos:{x:number, y:number};
    gs:GameScene;
    constructor(gs:GameScene, x:number, y:number) {
        this.gs = gs;
        this.pos = {x:x, y:y};
        this.blade = new Blade(gs, gs.ih);
        this.blade.sprite.setGravityY(C.GRAVITY);
        this.blade.sprite.setPosition(x+30, y+30);
        gs.realLayer.add(this.blade.sprite);
        gs.time.addEvent({
            delay:1200,
            callbackScope:this,
            callback:() =>{
                console.log('Dropper fired');
                this.blade.sprite.setVelocity(0,0);
                this.blade.sprite.setPosition(x+30, y - 60);
            },
            loop:true
        }); 
    }
}