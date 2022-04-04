import { throws } from "assert";
import { CustomEvents } from "../enum/CustomEvents";
import { Powerup } from "../enum/Powerup";
import { IH } from "../IH/IH";
import { GameScene } from "../scenes/GameScene";
import { SFX, SM } from "../SM";
import { Entity } from "./Entity";

export class NinjaStar extends Entity {
    alive:boolean = true;
    gs!:GameScene;
    constructor(gs:GameScene) {
        super(gs, gs.ih);
        this.gs = gs;
        this.sprite.setName('ninjastar')
        .setFrame('ninjastar_1');
        this.sprite.on(CustomEvents.HIT_PLAYER, () => {
            SM.PlaySFX(SFX.Slice);
            this.gs.events.emit(CustomEvents.PLAYER_DIED);
        });
        this.sprite.setCircle(4)
        .setDepth(49);
        

        this.sprite.on('collide', ()=> {
            this.alive = false;
            this.sprite.disableBody(true, true);
            this.sprite.setVisible(false);
        }, this);
    }

}