import { Player } from "../entities/Player";
import { LDtkMapPack, LdtkReader } from "../map/LDtkReader";
import { GameScene } from "../scenes/GameScene";

export class MapHelper {
    static CreateMap(gs:GameScene) {
        //TODO: Replace this with logic to get the right level.
        let level = 'Level_0';
        let r: LdtkReader = new LdtkReader(gs, gs.cache.json.get('levels'));

        //This is stupid to create the same map twice because it doesn't have 
        let solidmaps = r.CreateMap(level, 'solidts');
        gs.maps = solidmaps;
        // gs.realLayer.add(solidmaps.displayLayers.find(e => e.name == 'MG'));
        solidmaps.collideLayer.setCollision([1]);
        
        this.CreateEntities(gs, solidmaps);
        this.SetPhysics(gs, solidmaps);
        // let outlinemaps = r.CreateMap(level, 'outlinets');
        // gs.outlineLayer.add(outlinemaps.displayLayers.find(e => e.name == 'Outline'));


    }

    private static CreateEntities(gs:GameScene, level:LDtkMapPack) {
        let startlocation = level.entityLayers.entityInstances.find(e=>e.__identifier == 'NinjaStart');
        gs.p = new Player(gs, gs.ih);
        gs.p.sprite.setPosition(startlocation.px[0], startlocation.px[1]);
        gs.collideMap.push(gs.p.sprite);
    }

    static SetPhysics(gs:GameScene, level:LDtkMapPack) {
        gs.physics.add.collider(gs.collideMap, level.collideLayer);

    }

}