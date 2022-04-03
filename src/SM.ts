export class SM {
    static scene:Phaser.Scene;
    static currentSong:Music;

    static Register(s:Phaser.Scene) {
        this.scene = s;
    }

    static PlayMusic(m:Music) {
        if(m != '') {
            if(this.currentSong != null)
                this.scene.sound.stopByKey(this.currentSong);
            this.scene.sound.play(m);
            this.currentSong = m;
        }
    }

    static PlaySFX(sfx:SFX) {
        if(sfx != '') {
            this.scene.sound.play(sfx);
        }

    }


}

export enum Music {
    NONE = '',
    SLAP_THAT_NINJA = 'Slap That Ninja',
    Funkjutsu = 'Funkjutsu'
}

export enum SFX {
    NinjaJump = '',
    NinjaLand = '',
    Attack = '',
    StarThrow = '',
    StarHit = '',
    StarMiss = '',
// Smoke bomb throw
// Smoke bomb active
    NinjaDeath = '',
    NinjaVictory = '',
    WindowSmashing = '',
}