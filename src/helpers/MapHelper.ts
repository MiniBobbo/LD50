import { Blade } from "../entities/Blade";
import { Demon } from "../entities/Demon";
import { Dropper } from "../entities/Dropper";
import { Flag } from "../entities/Flag";
import { Magistrate } from "../entities/Magistrate";
import { NinjaStar } from "../entities/Ninjastar";
import { Player } from "../entities/Player";
import { SmallBlade } from "../entities/SmallBlade";
import { Soldier } from "../entities/Soldier";
import { Spike } from "../entities/Spike";
import { Supplies } from "../entities/Supplies";
import { CustomEvents } from "../enum/CustomEvents";
import { D } from "../enum/Direction";
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
                case EntityIdentifier.Dropper:
                    var delay = element.fieldInstances.find(e=>e.__identifier == 'Delay').__value as number;
                    let drop = new Dropper(gs, element.px[0],element.px[1], delay);
                    // f.sprite.setPosition(element.px[0]+10,element.px[1]+10);   
                    // gs.realLayer.add(f.sprite);
                    break;
                case EntityIdentifier.Flag:
                    let f = new Flag(gs, gs.ih);
                    var icon = element.fieldInstances.find(e=>e.__identifier == 'Sprite').__value as number;
                    f.sprite.setPosition(element.px[0]+10,element.px[1]+10);   
                    gs.realLayer.add(f.sprite);
                    if(icon == 1) {
                        f.sprite.anims.stop();
                        f.sprite.setFrame('flag_scroll_0');
                    }
                    else if(icon == 2) {
                        f.sprite.anims.stop();
                        f.sprite.setFrame('flag_key_0');
                    }
                    break;
                case EntityIdentifier.Supplies:
                    let supplies = new Supplies(gs, gs.ih);
                    supplies.sprite.setPosition(element.px[0],element.px[1]);   
                    gs.realLayer.add(supplies.sprite);
                    break;
                case EntityIdentifier.Soldier:
                    let s = new Soldier(gs, gs.ih);
                    s.sprite.setPosition(element.px[0]+10,element.px[1]+10);      
                    gs.realLayer.add(s.sprite);
                    gs.entities.add(s.sprite);
                    break;
                case EntityIdentifier.Magistrate:
                    let m = new Magistrate(gs, gs.ih);
                    m.sprite.setPosition(element.px[0]+10,element.px[1]+10);      
                    gs.realLayer.add(m.sprite);
                    gs.entities.add(m.sprite);
                    break;
                case EntityIdentifier.Blade:
                    let b = new Blade(gs, gs.ih);
                    b.sprite.setPosition(element.px[0],element.px[1]).setDepth(49);
                    gs.realLayer.add(b.sprite);
                    break;
                case EntityIdentifier.Demon:
                    let demon = new Demon(gs);
                    demon.sprite.setPosition(element.px[0],element.px[1]).setDepth(49);
                    gs.realLayer.add(demon.sprite);
                    break;
                case EntityIdentifier.SmallBlade:
                    let sb = new SmallBlade(gs, gs.ih);
                    sb.sprite.setPosition(element.px[0],element.px[1]).setDepth(49);
                    gs.realLayer.add(sb.sprite);
                    break;
                case EntityIdentifier.GroundSpikes:
                    var direction = element.fieldInstances.find(e=>e.__identifier == 'D');
                    let d:D = D[direction.__value as string];
                    let spike = new Spike(gs, gs.ih, d);
                    switch (d) {
                        case D.D:
                            spike.sprite.setPosition(element.px[0]+8,element.px[1]-5).setDepth(51);
                            break;
                        case D.U:
                            spike.sprite.setPosition(element.px[0]+8,element.px[1]-15).setDepth(51);
                            break;
                        case D.L:
                            spike.sprite.setPosition(element.px[0]+5,element.px[1]-11).setDepth(51);
                            break;
                        case D.R:
                            spike.sprite.setPosition(element.px[0]+15,element.px[1]-12).setDepth(51);
                            break;
                        default:
                            spike.sprite.setPosition(element.px[0]+8,element.px[1]-5).setDepth(51);
                            break;
                    }

                    gs.realLayer.add(spike.sprite);
                    break;
                // case EntityIdentifier.Thrower:
                //     let thrower = new Thrower(gs);
                //     ns.sprite.setPosition(element.px[0],element.px[1]).setDepth(49);
                //     gs.realLayer.add(ns.sprite);
                //     break;
                case EntityIdentifier.Text:
                    var words = element.fieldInstances.find(e=>e.__identifier == 'TextToWrite').__value as string;
                    let t = gs.add.text(0,35,words, {align:'center', fontFamily: '"Yeon Sung", "Arial"'})
                    .setFixedSize(60,0).setStroke('0#000', 3)
                    .setFontSize(8).setWordWrapWidth(60);
                    t.setPosition(element.px[0],element.px[1]+10).setDepth(49);
                    gs.realLayer.add(t);
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
        gs.physics.add.overlap(gs.p.sprite, gs.collidePlayer, (p:any, e:any) => {
            e.emit(CustomEvents.HIT_PLAYER, p);
        }); 


    }

}