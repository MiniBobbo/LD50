import { C } from "../C";
import { GameScene } from "../scenes/GameScene";
import { Blade } from "./Blade";

export class Dropper {
    blade:Blade;
    pos:{x:number, y:number};
    gs:GameScene;
    constructor(gs:GameScene, x:number, y:number, delay:number = 0) {
        this.gs = gs;
        this.pos = {x:x, y:y};
        this.blade = new Blade(gs, gs.ih);
        this.blade.sprite.setPosition(x+30 , y+30);
        gs.realLayer.add(this.blade.sprite);
        this.blade.sprite.setScale(.9,.9);
        gs.time.addEvent({
            delay:delay,
            callbackScope:this,
            callback:() =>{
                this.blade.sprite.setGravityY(C.GRAVITY);
            },
            loop:true
        }); 

        this.gs.events.on('update', () => {
            if(this.blade.sprite.y > this.gs.maps.collideLayer.height + 100) {
                this.blade.sprite.setVelocity(0,0);
                this.blade.sprite.setPosition(x+30, y - 60);

            }

        })
    }
}