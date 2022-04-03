import { C } from "../C";
import { Player } from "../entities/Player";
import { CustomEvents } from "../enum/CustomEvents";
import { D } from "../enum/Dir";
import { GameScene } from "../scenes/GameScene";
import { SFX, SM } from "../SM";
import { FSMModule } from "./FSMModule";

export class NinjaFSM extends FSMModule {
    target:{x:number, y:number};
    p:Player;
    gs:GameScene;
    dir:D;

    running:boolean = true;

    moduleStart(args: any): void {
        this.p = this.parent as Player;
        this.gs = this.p.gs;

        this.target = {x:0, y:0};


        this.gs.events.on(CustomEvents.PLAYER_CLICKED, this.Clicked, this);

        this.p.PlayAnimation('crouch');
        this.p.sprite.setGravity(0, 0);
        this.dir = D.D;

        

        // let spdx = this.p.sprite.body.velocity.x;
        // let spdy = this.p.sprite.body.velocity.y;
        
        // if(spdx > 0)
        //     this.p.sprite.flipX == false;
        // else
        //     this.p.sprite.flipX == true;

        // if(Math.abs(spdx) > spdy)
        //     this.p.PlayAnimation('jump_side');
        // else
        //     this.p.PlayAnimation('jump_up');
    }

    moduleEnd(args: any): void {
        this.gs.events.removeListener(CustomEvents.PLAYER_CLICKED, this.Clicked, this);
        
    }

    Clicked() {
        //Ready to jump
        if(this.dir != D.None) {
            this.TryJump();
        }
    }

    TryJump() {
        //Check the screen position and not the world position.  That will mess up depending on the camera.
        let cam = this.gs.cameras.main;
        let cpos = {x: cam.scrollX + this.gs.cursor.x, y: cam.scrollY + this.gs.cursor.y}; 
        switch (this.dir) {
            case D.D:
                if(cpos.y < this.p.sprite.y) {
                    this.Jump(cpos);
                }
                else {
                    this.target.x = cpos.x;
                    this.target.y = this.p.sprite.y;
                    this.Run();
                }
            
                break;
            case D.U:
                if(cpos.y > this.p.sprite.y) {
                    this.Jump(cpos);
                }
                else {
                    // this.target.x = this.gs.cursor.x;
                    // this.target.y = this.p.sprite.y;
                    // this.Run();
                }
            
                break;
            case D.L:
                if(cpos.x > this.p.sprite.x) {
                    this.Jump(cpos);
                }
                else {
                    //TODO: Climb?
                }
            
            break;
        case D.R:
                if(cpos.x < this.p.sprite.x) {
                    this.Jump(cpos);
                }
                else {
                    //TODO: Climb?
                }
            
            break;
        
            default:
                break;
        }

    }

    Jump(cpos:{x:number, y:number}) {
        // this.gs.cursor.y | this.p.sprite.y

        SM.PlaySFX(SFX.NinjaJump);
        let a = Phaser.Math.Angle.BetweenPoints(this.gs.p.sprite, cpos);
        let v = new Phaser.Math.Vector2(C.NINJA_JUMP_STR, 0);
        v.rotate(a);
        this.p.sprite.setVelocity(v.x, v.y);
        // this.parent.changeFSM('jump');
        this.dir = D.None;
        this.p.sprite.setGravity(0, C.GRAVITY);
        if(v.x > 0)
            this.p.sprite.flipX = false;
        else 
            this.p.sprite.flipX = true;
        if(Math.abs(v.x) > v.y) {
            this.p.PlayAnimation('jump_side');
        } else
            this.p.PlayAnimation('jump_up');


    }

    /**
     * Runs to the given location.  Make sure this is on the right plane!
     */
    Run() {
        this.running = true;
        this.p.sprite.setGravityY(C.GRAVITY);
        if(this.target.x > this.p.sprite.x) 
            this.p.sprite.setVelocityX(C.NINJA_GROUND_SPEED);
        else    
            this.p.sprite.setVelocityX(-C.NINJA_GROUND_SPEED);

    }

    update(dt: number): void {
        if(this.dir == D.None) {
            //Check for landing
            if(!this.p.sprite.body.blocked.none) {
                //Landed
                SM.PlaySFX(SFX.NinjaLand);
                this.p.sprite.setVelocity(0,0);
                this.p.sprite.setGravity(0,0);
                if(this.p.sprite.body.blocked.left) {
                    this.dir = D.L;
                    this.p.PlayAnimation('wallgrab');
                    this.p.sprite.flipX = false;
                }
                else if(this.p.sprite.body.blocked.right) {
                    this.dir = D.R;
                    this.p.PlayAnimation('wallgrab');
                    this.p.sprite.flipX = true;
                }
                else if(this.p.sprite.body.blocked.down) {
                    this.dir = D.D;
                    this.p.PlayAnimation('crouch');
                }
                else if(this.p.sprite.body.blocked.up) {
                    this.dir = D.U;
                    this.p.PlayAnimation('hang');
                }

            }
        }  else if(this.running) {
            if(!this.p.sprite.body.blocked.down) {
                this.StopRun();
            } else if(this.p.sprite.body.velocity.x > 0 && this.p.sprite.x >= this.target.x) {
                this.StopRun();
            } else if(this.p.sprite.body.velocity.x < 0 && this.p.sprite.x <= this.target.x) {
                this.StopRun();
            }
    
        }
        
    }
    StopRun() {
        this.p.sprite.setVelocityX(0);
        this.running = false;
    }
}