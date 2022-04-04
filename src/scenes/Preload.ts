import { C } from "../C";
import { GameData } from "../GameData";
import { IH } from "../IH/IH";

export class Preload extends Phaser.Scene {
    LoadCount:number = 0;
    preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
            }
        });

        assetText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', function (value:any) {
            //@ts-ignore
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
        
        this.load.on('fileprogress', function (file:any) {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
            //@ts-ignore
            this.Finished();
        }, this);
    
        this.load.setBaseURL('./assets/')
        // this.load.image('mapts', ['tiles.png', 'tiles_n.png']);
        this.load.bitmapFont('6px', '8ptfont_0.png', '8ptfont.fnt');
        this.load.multiatlas('atlas', 'atlas.json');
        this.load.multiatlas('atlas_o', 'atlas_o.json');
        this.load.image('solidts', 'tileset_main.png');
        this.load.image('outlinets', 'tileset_o.png');
        // this.load.image('mockup_0');
        // this.load.image('mockup_1');
        this.load.image('lighttest');
        this.load.json('levels', 'Levels.ldtk');
        this.load.audio('powerup', ['./sounds/Powerup.wav']);
        this.load.audio('slice1', ['./sounds/Slash_Enemy_Kill.wav']);
        this.load.audio('slice2', ['./sounds/Slash_Enemy_Kill_2.wav']);
        this.load.audio('ninjadeath', ['./sounds/Player_death.wav']);
        this.load.audio('ninjaland1', ['./sounds/Jump_landing_1.wav']);
        this.load.audio('ninjaland2', ['./sounds/Jump_landing_2.wav']);
        this.load.audio('woosh1', ['./sounds/Jump_whoosh_1.wav']);
        this.load.audio('woosh2', ['./sounds/Jump_whoosh_2.wav']);
        this.load.audio('woosh3', ['./sounds/Jump_whoosh_3.wav']);
        this.load.audio('Funkjutsu', ['./music/Funkjutsu_2.mp3']);
        this.load.audio('Slap That Ninja', ['./music/Slap_That_Ninja.mp3']);
        // this.load.audio()

    }LD50



    create() {

        //@ts-ignore
        WebFont.load({
            google: {
                families: [ 'Yeon Sung' ]
                },
            active: () =>{
                this.Finished();
            },
            
        });
        // if(C.gd == null) {
        //     C.gd = JSON.parse(localStorage.getItem(C.GAME_NAME));
        //     if(C.gd == null) {
        //         C.gd = new GameData();
        //         localStorage.setItem(C.GAME_NAME, JSON.stringify(C.gd));
        //     }
        // }

        // if(C.TopTimes == null) {
        //     C.TopTimes = new Map<string, number>();
        // }

        C.gd = new GameData();
        // localStorage.clear();
        // C.gd = JSON.parse(localStorage.getItem(C.GAME_NAME));
        // if(C.gd == null) {
        //     C.gd = new GameData();
        //     localStorage.setItem(C.GAME_NAME, JSON.stringify(C.gd));
        // }

        IH.AddVirtualInput('action');
        IH.AddVirtualInput('restart');
        IH.AddVirtualInput('menu');

        IH.AssignKeyToVirtualInput('SPACE', 'action');
        IH.AssignKeyToVirtualInput('R', 'restart');
        IH.AssignKeyToVirtualInput('M', 'menu');

        // this.anims.create({ key: 'ninja_run', frameRate: 60, frames: this.anims.generateFrameNames('atlas', { prefix: 'ninja_running_', end: 5}), repeat: -1 });
        this.CreateAnimSet('ninja_appear', 'ninja_disappear_', 3, 0, 12);
        this.CreateAnimSet('ninja_disappear', 'ninja_disappear_', 5, 0, 12);
        this.CreateAnimSet('ninja_run', 'ninja_running_', 5, -1, 30);
        this.CreateAnimSet('ninja_wallgrab', 'ninja_wallgrab_', 1, -1, 1);
        this.CreateAnimSet('ninja_crouch', 'ninja_idle_', 1, -1, 1);
        this.CreateAnimSet('ninja_hang', 'ninja_hang_', 1, -1, 1);
        this.CreateAnimSet('ninja_jump_up', 'ninja_jump_up_', 23, 0, 60, 3);
        this.CreateAnimSet('ninja_jump_side', 'ninja_jump_side_', 23, 0, 60, 3);
        this.CreateAnimSet('flag_wave', 'flag_wave_', 3, -1, 6);
        this.CreateAnimSet('soldier_stand', 'soldier_stand_', 0, 0, 6);
        this.CreateAnimSet('soldier_dead', 'soldier_dead_', 8, 0, 12);
        this.CreateAnimSet('effect_poof', 'poof_', 48, 0, 60);
        this.CreateAnimSet('effect_fire', 'fire_', 29, -1, 60);
        // this.anims.create({ key: 'player_stand', frameRate: 60, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_stand_', end: 0}), repeat: -1 });
        // this.anims.create({ key: 'player_run', frameRate: 20, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_run_', end: 7}), repeat: -1 });
        // this.anims.create({ key: 'player_jumpup', frameRate: 20, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_jumpup_', end: 0}), repeat: -1 });
        // this.anims.create({ key: 'player_jumpdown', frameRate: 20, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_jumpdown_', end: 3}), repeat: 0 });

    }
    Finished() {
        this.LoadCount++;
        if(this.LoadCount == 2)
            // this.scene.start('menu');
            this.scene.start('game', {levelName:'Level_9'});
    }

    private CreateAnimSet(key:string, prefix:string, end:number, repeat:number, frameRate:number = 20, padding:number = 0) {
        this.anims.create({ key: key, frameRate: frameRate, frames: this.anims.generateFrameNames('atlas', { prefix: prefix, end: end, zeroPad:padding}), repeat: repeat });
        // console.log(`Creating `);
        // this.anims.create({ key: `${key}_o`, frameRate: frameRate, frames: this.anims.generateFrameNames('atlas_o', { prefix: prefix, end: end}), repeat: repeat });
        
    }

}