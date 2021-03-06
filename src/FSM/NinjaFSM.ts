import { C } from "../C";
import { Player } from "../entities/Player";
import { CustomEvents } from "../enum/CustomEvents";
import { D } from "../enum/Direction";
import { GameScene } from "../scenes/GameScene";
import { SFX, SM } from "../SM";
import { FSMModule } from "./FSMModule";

export class NinjaFSM extends FSMModule {
    target:{x:number, y:number};
    p:Player;
    gs:GameScene;
    dir:D;


    running:boolean = false;

    moduleStart(args: any): void {
        this.p = this.parent as Player;
        this.gs = this.p.gs;

        this.target = {x:0, y:0};


        this.gs.events.on(CustomEvents.PLAYER_CLICKED, this.Clicked, this);

        this.p.PlayAnimation('crouch');
        this.p.sprite.setGravity(0, 0);
        this.dir = D.D;

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
        //Calculate the cursor world position.  That will mess up depending on the camera.
        let cam = this.gs.cameras.main;
        let cpos = {x: cam.scrollX + this.gs.cursor.x, y: cam.scrollY + this.gs.cursor.y}; 
        let spos = {x: this.p.sprite.x, y: this.p.sprite.y}; 
        switch (this.dir) {
            case D.D:
                if(cpos.y < spos.y) {
                    this.Jump(cpos);
                }
                else {
                    this.target.x = cpos.x;
                    this.target.y = spos.y;
                    this.Run();
                }
            
                break;
            case D.U:
                if(cpos.y > spos.y) {
                    this.Jump(cpos);
                }
                else {
                    if(cpos < spos) {
                        //Check for left flipup
                        if(!C.GetTile(spos.x, spos.y - C.NINJA_FLIP_DISTANCE).collides) {
                            this.p.sprite.x += C.TILE_SIZE;
                            this.Flip(D.UL);
                        }
                        else if(cpos.x < spos.x) {
                            if(!C.GetTile(spos.x - C.NINJA_FLIP_DISTANCE, spos.y - C.NINJA_FLIP_DISTANCE).collides)
                                this.Flip(D.UL);
                        } 

                    } else {
                        //Check for right flipup
                        if(!C.GetTile(spos.x, spos.y - C.NINJA_FLIP_DISTANCE).collides) {
                            this.p.sprite.x -= C.TILE_SIZE;
                            this.Flip(D.UR);
                        }
                        else if(cpos.x < spos.x) {
                            if(!C.GetTile(spos.x + C.NINJA_FLIP_DISTANCE, spos.y - C.NINJA_FLIP_DISTANCE).collides)
                                this.Flip(D.UR);
                        } 

                    }
                }
            
                break;
            case D.L:
                if(cpos.x > spos.x) {
                    this.Jump(cpos);
                } else if (cpos.x > spos.x - C.JUMP_UP_DOWN_GRACE_SIZE) {
                    //This is a game feel movement enhancement.  If the player is clicking below them but they have the angle slightly too shallow assume that they mean to jump down and jump parallel to the wall.
                    console.log("Left side grace run");
                    cpos.x = spos.x;
                    this.Jump(cpos);
                }
                else {
                    //TODO: Climb?
                }
            
            break;
        case D.R:
                if(cpos.x < spos.x) {
                    this.Jump(cpos);
                } else if (cpos.x < spos.x + C.JUMP_UP_DOWN_GRACE_SIZE*2) {
                    //This is a game feel movement enhancement.  If the player is clicking below them but they have the angle slightly too shallow assume that they mean to jump down and jump parallel to the wall.
                    console.log("Right side grace run");
                    cpos.x = spos.x;
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
        this.running = false;
        SM.PlaySFX(SFX.Woosh);
        let a = Phaser.Math.Angle.BetweenPoints(this.gs.p.sprite.body, cpos);
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
        if(Math.abs(v.x) > Math.abs(v.y)) {
            this.p.PlayAnimation('jump_side');
        } else {
            this.p.PlayAnimation('jump_up');

        }


    }

    /**
     * Runs to the given location.  Make sure this is on the right plane!
     */
    Run() {
        this.running = true;
        this.p.PlayAnimation('run');
        this.p.sprite.setGravityY(C.GRAVITY);
        if(this.target.x > this.p.sprite.x) {
            this.p.sprite.setVelocityX(C.NINJA_GROUND_SPEED);
            this.p.sprite.flipX = false;
        }
        else {
            this.p.sprite.setVelocityX(-C.NINJA_GROUND_SPEED);
            this.p.sprite.flipX = true;
        }    

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
                //Insetad of just falling, swing down and grab into the ledge that we just fell from.
                this.Flip(D.D);
            } else if(this.p.sprite.body.velocity.x > 0 && this.p.sprite.x >= this.target.x) {
                this.StopRun();
                this.p.PlayAnimation('crouch');
            } else if(this.p.sprite.body.velocity.x < 0 && this.p.sprite.x <= this.target.x) {
                this.StopRun();
                this.p.PlayAnimation('crouch');
            } else if(this.p.sprite.body.blocked.left) {
                this.dir = D.L;
                this.p.PlayAnimation('wallgrab');
                this.p.sprite.flipX = false;
            }
            else if(this.p.sprite.body.blocked.right) {
                this.dir = D.R;
                this.p.PlayAnimation('wallgrab');
                this.p.sprite.flipX = true;
            }
        }
    }

    
    Flip(direction:D) {
        //TODO:  Add a delay fo the animation here.

        this.p.sprite.setVelocity(0,0);
        this.p.sprite.setGravity(0,0);
        this.StopRun();

        if(direction == D.D) {
            this.p.sprite.y += 10;
            this.p.PlayAnimation('wallgrab');
            //TODO: Add animation here.  
            if(this.p.sprite.flipX) {
                this.dir = D.R;
            } else
            this.dir = D.L;
        } else if (direction == D.UL) {
            let pos = C.RoundToTile(this.p.sprite.x - C.TILE_SIZE, this.p.sprite.y - C.TILE_SIZE);
            this.p.sprite.setPosition(pos.x+4, pos.y);
            this.dir = D.R;
            this.p.PlayAnimation('wallgrab');
            this.p.sprite.flipX = true;
        } else if (direction == D.UR) {
            let pos = C.RoundToTile(this.p.sprite.x + C.TILE_SIZE, this.p.sprite.y - C.TILE_SIZE);
            this.p.sprite.setPosition(pos.x-4, pos.y);
            this.dir = D.L;
            this.p.PlayAnimation('wallgrab');
            this.p.sprite.flipX = false;
        }

}
    StopRun() {
        this.p.sprite.setVelocityX(0);
        this.running = false;
    }
}