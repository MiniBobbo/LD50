import { Flag } from "../entities/Flag";
import { Player } from "../entities/Player";
import { CustomEvents } from "../enum/CustomEvents";
import { EntityIdentifier, LDtkMapPack, LdtkReader } from "../map/LDtkReader";
import { GameScene } from "../scenes/GameScene";
import { WinConditions } from "../WinConditions";

export class MapHelper {
    static CreateMap(gs:GameScene, levelName:string) {
        //TODO: Replace this with logic to get the right level.
        let level = levelName;
        let r: LdtkReader = new LdtkReader(gs, gs.cache.json.get('levels'));

        //This is stupid to create the same map twice because it doesn't have 
        let solidmaps = r.CreateMap(level, 'solidts');
        gs.maps = solidmaps;
        // gs.realLayer.add(solidmaps.displayLayers.find(e => e.name == 'MG'));
        solidmaps.collideLayer.setCollision([1]);
        
        this.CreateEntities(gs, solidmaps);
        this.SetPhysics(gs, solidmaps);
        gs.Win = new WinConditions(gs, solidmaps);
        gs.add.bitmapText(10,235, '6px', gs.Win.GoalText).setScrollFactor(0,0).setDepth(1000);
        // let outlinemaps = r.CreateMap(level, 'outlinets');
        // gs.outlineLayer.add(outlinemaps.displayLayers.find(e => e.name == 'Outline'));


    }

    private static CreateEntities(gs:GameScene, level:LDtkMapPack) {
        let startlocation = level.entityLayers.entityInstances.find(e=>e.__identifier == 'NinjaStart');
        gs.p = new Player(gs, gs.ih);
        gs.p.sprite.setPosition(startlocation.px[0], startlocation.px[1]);
        gs.collideMap.push(gs.p.sprite);

        level.entityLayers.entityInstances.forEach(element => {
            switch (element.__identifier) {
                case EntityIdentifier.Flag:
                    let f = new Flag(gs, gs.ih);
                    f.sprite.setPosition(element.px[0]+10,element.px[1]+10);                    
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