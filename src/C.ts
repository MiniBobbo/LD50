import { GameData } from "./GameData";

export class C {
    static currentLevel:string = '';

    static MOUSE_SENSITIVITY:number = .5;
    static GAME_WIDTH:number = 250;

    static cursorFrame:string = 'cursor_4';

    static TILE_SIZE:number = 20;
    static GRAVITY:number = 800;

    // static GRAVITY:number = 1000;
    static MAX_Y_SPEED:number = 500;
    static NINJA_GROUND_SPEED:number = 250;
    static NINJA_JUMP_STR:number = 500;

    static gd:GameData;

    static GAME_NAME = 'InevitableRevenge';

    static RoundToTile(x:number, y:number):{x:number, y:number} {
        let newX = 0;
        let newY = 0;
        newX = Math.floor(x/C.TILE_SIZE) * C.TILE_SIZE;
        newY = Math.floor(y/C.TILE_SIZE) * C.TILE_SIZE;
        return {x:newX, y:newY};
    }

    

}