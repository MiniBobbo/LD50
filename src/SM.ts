export class SM {
    static scene:Phaser.Scene;
    static currentSong:Music;
    static r:Phaser.Math.RandomDataGenerator;
    static Register(s:Phaser.Scene) {
        this.scene = s;
        this.r = new Phaser.Math.RandomDataGenerator();
    }

    static PlayMusic(m:Music) {
        if(m != '') {
            if(this.currentSong != null)
                this.scene.sound.stopByKey(this.currentSong);
            this.scene.sound.play(m, {
                loop:true,
                volume:.5
            });
            this.currentSong = m;
        }
    }

    static PlaySFX(sfx:SFX) {
        if(sfx != '') {
            switch (sfx) {
                case SFX.Slice:

                    if(this.r.between(0,1) == 0)
                    this.scene.sound.play(SFX.Slice1);
                    else
                    this.scene.sound.play(SFX.Slice2);
                    break;
                case SFX.NinjaLand:

                    if(this.r.between(0,1) == 0)
                    this.scene.sound.play(SFX.NinjaLand1);
                    else
                    this.scene.sound.play(SFX.NinjaLand2);
                    break;
                case SFX.Woosh:
                    let n =this.r.between(0,2);
                    if(n == 0)
                    this.scene.sound.play(SFX.Woosh1);
                    else if (n==1)
                    this.scene.sound.play(SFX.Woosh2);
                    else
                    this.scene.sound.play(SFX.Woosh3);

                    break;

                default:
                    this.scene.sound.play(sfx);
                    break;
            }
        }

    }


}

export enum Music {
    NONE = '',
    SLAP_THAT_NINJA = 'Slap That Ninja',
    Funkjutsu = 'Funkjutsu'
}

export enum SFX {
    Slice = 'slice',
    Slice1 = 'slice1',
    Slice2 = 'slice2',
    Woosh = 'woosh',
    Woosh1 = 'woosh1',
    Woosh2 = 'woosh2',
    Woosh3 = 'woosh3',
    NinjaLand = 'ninjaland',
    NinjaLand1 = 'ninjaland1',
    NinjaLand2 = 'ninjaland2',
    Attack = '',
    StarThrow = '',
    StarHit = '',
    StarMiss = '',
// Smoke bomb throw
// Smoke bomb active
    NinjaDeath = 'ninjadeath',
    NinjaVictory = '',
    WindowSmashing = '',
}