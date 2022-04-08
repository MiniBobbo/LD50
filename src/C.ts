import { GameData } from "./GameData";
import { Music } from "./SM";

export class C {
    static currentLevel:string = '';
    static CurrentCollisionLayer:Phaser.Tilemaps.TilemapLayer;

    static MOUSE_SENSITIVITY:number = .5;
    static GAME_WIDTH:number = 400;

    static cursorFrame:string = 'cursor_4';

    static TILE_SIZE:number = 20;
    static GRAVITY:number = 800;

    // static GRAVITY:number = 1000;
    static MAX_Y_SPEED:number = 500;
    static NINJA_GROUND_SPEED:number = 400;
    static NINJA_JUMP_STR:number = 500;
    static NINJASTAR_THROW_STRENGTH = 600;

    //How far should we let the ninja flip up something?
    static NINJA_FLIP_DISTANCE:number = 20;

    static JUMP_UP_DOWN_GRACE_SIZE:number = 10;

    //Stores the last cursor position so we can put it back in place when the screen transitions.
    static LastCursorPosition:{x:number, y:number};

    static SelectedChapter:number = 0;
    static SelectedMusic:Music;

    static gd:GameData;

    static GAME_NAME = 'InevitableRevenge';

    static RoundToTile(x:number, y:number):{x:number, y:number} {
        let newX = 0;
        let newY = 0;
        newX = Math.floor(x/C.TILE_SIZE) * C.TILE_SIZE + (C.TILE_SIZE/2);
        newY = Math.floor(y/C.TILE_SIZE) * C.TILE_SIZE + (C.TILE_SIZE/2);
        return {x:newX, y:newY};
    }

    GetTileFromWorld(x:number, y:number):{x:number, y:number} {
        return {
            x:Math.floor(x/C.TILE_SIZE),
            y:Math.floor(y/C.TILE_SIZE)
        };
    }

    static GetTile(x: number, y:number):Phaser.Tilemaps.Tile {
        return this.CurrentCollisionLayer.getTileAtWorldXY(x,y);
    }

    

}