import { IH } from "../IH/IH";

export class Preload extends Phaser.Scene {
    preload() {
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
            this.scene.start('menu');
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
        // this.load.audio()

    }


    create() {
        IH.AddVirtualInput('up');
        IH.AddVirtualInput('down');
        IH.AddVirtualInput('left');
        IH.AddVirtualInput('right');
        IH.AddVirtualInput('jump');
        IH.AddVirtualInput('throw');
        IH.AddVirtualInput('attack');

        IH.AssignKeyToVirtualInput('UP', 'up');
        IH.AssignKeyToVirtualInput('DOWN', 'down');
        IH.AssignKeyToVirtualInput('LEFT', 'left');
        IH.AssignKeyToVirtualInput('RIGHT', 'right');
        IH.AssignKeyToVirtualInput('W', 'up');
        IH.AssignKeyToVirtualInput('S', 'down');
        IH.AssignKeyToVirtualInput('A', 'left');
        IH.AssignKeyToVirtualInput('D', 'right');
        IH.AssignKeyToVirtualInput('Z', 'jump');
        IH.AssignKeyToVirtualInput('L', 'jump');
        IH.AssignKeyToVirtualInput('K', 'attack');
        IH.AssignKeyToVirtualInput('X', 'attack');
        IH.AssignKeyToVirtualInput('O', 'throw');

        // this.anims.create({ key: 'ninja_run', frameRate: 60, frames: this.anims.generateFrameNames('atlas', { prefix: 'ninja_running_', end: 5}), repeat: -1 });
        this.CreateAnimSet('ninja_appear', 'ninja_disappear_', 3, 0, 12);
        this.CreateAnimSet('ninja_disappear', 'ninja_disappear_', 3, 0, 12);
        this.CreateAnimSet('ninja_run', 'ninja_running_', 5, -1, 30);
        this.CreateAnimSet('ninja_wallgrab', 'ninja_wallgrab_', 1, -1, 1);
        this.CreateAnimSet('ninja_crouch', 'ninja_idle_', 1, -1, 1);
        this.CreateAnimSet('ninja_hang', 'ninja_hang_', 1, -1, 1);
        this.CreateAnimSet('ninja_jump_up', 'ninja_wallgrab_', 1, -1, 30);
        this.CreateAnimSet('ninja_jump_side', 'ninja_wallgrab_', 1, -1, 30);
        this.CreateAnimSet('flag_wave', 'flag_wave_', 3, -1, 6);
        // this.anims.create({ key: 'player_stand', frameRate: 60, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_stand_', end: 0}), repeat: -1 });
        // this.anims.create({ key: 'player_run', frameRate: 20, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_run_', end: 7}), repeat: -1 });
        // this.anims.create({ key: 'player_jumpup', frameRate: 20, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_jumpup_', end: 0}), repeat: -1 });
        // this.anims.create({ key: 'player_jumpdown', frameRate: 20, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_jumpdown_', end: 3}), repeat: 0 });

    }

    private CreateAnimSet(key:string, prefix:string, end:number, repeat:number, frameRate:number = 20) {
        this.anims.create({ key: key, frameRate: frameRate, frames: this.anims.generateFrameNames('atlas', { prefix: prefix, end: end}), repeat: repeat });
        // console.log(`Creating `);
        // this.anims.create({ key: `${key}_o`, frameRate: frameRate, frames: this.anims.generateFrameNames('atlas_o', { prefix: prefix, end: end}), repeat: repeat });
        
    }

}