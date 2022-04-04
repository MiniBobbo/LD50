import { Blade } from "../entities/Blade";
import { Flag } from "../entities/Flag";
import { Player } from "../entities/Player";
import { Soldier } from "../entities/Soldier";
import { CustomEvents } from "../enum/CustomEvents";
import { EntityIdentifier, LDtkMapPack, LdtkReader } from "../map/LDtkReader";
import { GameScene } from "../scenes/GameScene";
import { WinConditions } from "../WinConditions";

export class MapHelper {
    static CreateMap(gs:GameScene, levelName:string) {
        //TODO: Replace this with logic to get the right level.
        let level = levelName;
        let r: LdtkReader = new LdtkReader(gs, gs.cache.json.get('levels'));

        //This is stupid to create the same map twice because it doesn't have the ability to 
        //one map doesn't use multiple tilesets but I don'd have time to change it.
        let solidmaps = r.CreateMap(level, 'solidts');
        gs.maps = solidmaps;
        solidmaps.displayLayers.forEach(element => {
            gs.realLayer.add(element);
        });
        // gs.realLayer.add(solidmaps.displayLayers.find(e => e.name == 'MG'));
        solidmaps.collideLayer.setCollision([1]);
        
        this.CreateEntities(gs, solidmaps);
        this.SetPhysics(gs, solidmaps);
        gs.Win = new WinConditions(gs, solidmaps);
        let vt = gs.add.text(0,2, gs.Win.GoalText, {align:'center', fontFamily: '"Yeon Sung", "Arial"'})
        .setScrollFactor(0,0).setFontSize(16).setWordWrapWidth(250).setFixedSize(250,0);
        gs.HudLayer.add(vt);
        // let outlinemaps = r.CreateMap(level, 'outlinets');
        // gs.outlineLayer.add(outlinemaps.displayLayers.find(e => e.name == 'Outline'));


    }

    private static CreateEntities(gs:GameScene, level:LDtkMapPack) {
        let startlocation = level.entityLayers.entityInstances.find(e=>e.__identifier == 'NinjaStart');
        gs.p = new Player(gs, gs.ih);
        gs.p.sprite.setPosition(startlocation.px[0], startlocation.px[1]).setDepth(50);
        gs.collideMap.push(gs.p.sprite);
        gs.realLayer.add(gs.p.sprite);

        level.entityLayers.entityInstances.forEach(element => {
            switch (element.__identifier) {
                case EntityIdentifier.Flag:
                    let f = new Flag(gs, gs.ih);
                    f.sprite.setPosition(element.px[0]+10,element.px[1]+10);   
                    gs.realLayer.add(f.sprite);                 
                    break;
                case EntityIdentifier.Soldier:
                    let s = new Soldier(gs, gs.ih);
                    s.sprite.setPosition(element.px[0]+10,element.px[1]+10);      
                    gs.realLayer.add(s.sprite);              
                    break;
                case EntityIdentifier.Blade:
                    let b = new Blade(gs, gs.ih);
                    b.sprite.setPosition(element.px[0],element.px[1]).setDepth(49);
                    gs.realLayer.add(b.sprite);              
                    break;
                default:
                    break;
            } 
        });
    }

    static SetPhysics(gs:GameScene, level:LDtkMapPack) {
        gs.physics.add.collider(gs.collideMap, level.collideLayer);
        gs.physics.add.overlap(gs.p.sprite, gs.collidePlayer, (p:any, e:any) => {
            e.emit(CustomEvents.HIT_PLAYER, p);
        }); 


    }

}