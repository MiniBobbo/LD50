export class LdtkReader {
    json:any;
    scene:Phaser.Scene;
    tilesets:Array<any>;
    ldtk:iLDtk;
    constructor(scene:Phaser.Scene, filejson:any) {
        this.json = filejson;
        this.scene = scene;
        this.tilesets = this.json.defs.tilesets;
        this.ldtk = filejson;
        
    }

    CreateMap(levelName:string, tileset:string):LDtkMapPack {
        let j = this.ldtk;
        var levels = j.levels;
        let level:Level = levels.find((l: any) => l.identifier === levelName);
        let mappack:LDtkMapPack = new LDtkMapPack();
        // mappack.bgColor = level.bgColor;
        mappack.settings = level.fieldInstances;
        level.layerInstances.forEach(layer => {
            if(layer.__type === 'IntGrid') {
                mappack.collideLayer = this.CreateIntGridLayer(layer, tileset);
            } else if (layer.__type === 'AutoLayer') {
                mappack.displayLayers.push(this.CreateAutoLayer(layer, tileset));
            } else if (layer.__type === 'Tiles') {
                mappack.displayLayers.push(this.CreateTileLayer(layer, tileset));
            }
        });
        mappack.entityLayers = level.layerInstances.find((l:LayerInstance) => l.__type === 'Entities');

        return mappack;
    }



    CreateTileLayer(layer:LayerInstance, tileset:string):Phaser.Tilemaps.TilemapLayer {
        let map:Phaser.Tilemaps.Tilemap;
        let csv = new Array(layer.__cHei);
        for (var i = 0; i < csv.length; i++) {
            csv[i] = new Array(layer.__cWid);
        }
        let tilesetObj = this.tilesets.find((t: any) => t.uid === layer.__tilesetDefUid)
        let tilesetWidth = tilesetObj.__cWid;
        let tileSize = layer.__gridSize;

        layer.gridTiles.forEach(t => {
            let tileloc = this.GetTileXY(t.px[0], t.px[1], layer.__gridSize);
            csv[tileloc.y][tileloc.x] = this.GetTileID(t.src[0], t.src[1], tileSize, tilesetWidth) ;
        });

        map = this.scene.make.tilemap({
            data:csv,
            tileWidth: layer.__gridSize,
            tileHeight: layer.__gridSize
        });

        let ti = map.addTilesetImage(tileset);
        let l = map.createLayer(0, ti, 0,0).setVisible(true);
        l.name = layer.__identifier;

        layer.gridTiles.forEach(t => {
            if(t.f != 0) {
                let tileloc = this.GetTileXY(t.px[0], t.px[1], layer.__gridSize);
                let tile = l.getTileAt(tileloc.x, tileloc.y);
                if(tile != null) {
                    if(t.f == 1)
                    tile.flipX = true;
                    else if (t.f == 2)
                        tile.flipY = true;
                    else {
                        tile.flipX = true;
                        tile.flipY = true;
                    }
                }

            }
        });
        return l;
    }


    CreateAutoLayer(layer:any, tileset:string):Phaser.Tilemaps.TilemapLayer {
        let map:Phaser.Tilemaps.Tilemap;
        let csv = new Array(layer.__cHei);
        for (var i = 0; i < csv.length; i++) {
            csv[i] = new Array(layer.__cWid);
        }
        let tilesetObj = this.tilesets.find((t: any) => t.uid === layer.__tilesetDefUid)
        let tilesetWidth = tilesetObj.__cWid;
        let tileSize = layer.__gridSize;

        layer.autoLayerTiles.forEach(t => {
            let tileloc = this.GetTileXY(t.px[0], t.px[1], layer.__gridSize);
            csv[tileloc.y][tileloc.x] = this.GetTileID(t.src[0], t.src[1], tileSize, tilesetWidth) ;
        });

        map = this.scene.make.tilemap({
            data:csv,
            tileWidth: layer.__gridSize,
            tileHeight: layer.__gridSize
        });

        let ti = map.addTilesetImage(tileset);
        let l = map.createLayer(0, ti, 0,0).setVisible(true);
        l.name = layer.__identifier;

        layer.autoLayerTiles.forEach(t => {
            if(t.f != 0) {
                let tileloc = this.GetTileXY(t.px[0], t.px[1], layer.__gridSize);
                let tile = l.getTileAt(tileloc.x, tileloc.y);
                if(tile != null) {
                    if(t.f == 1)
                    tile.flipX = true;
                    else if (t.f == 2)
                        tile.flipY = true;
                    else {
                        tile.flipX = true;
                        tile.flipY = true;
                    }
                }

            }
        });

        
        return l;
    }

    GetTileXY(x:number, y:number, size:number):{x:number, y:number} {
        return {
            x:x/size,
            y:y/size
        };
    }

    private GetTileID(x:number, y:number, size:number, tilesetWidth:number):number {
        x = x/size;
        y = y/size;
        return x + (y * tilesetWidth);

    }

    CreateIntGridLayer(layer:any, tileset:string):Phaser.Tilemaps.TilemapLayer {
        let map:Phaser.Tilemaps.Tilemap;
        var csv = layer.intGridCsv;
        map = this.scene.make.tilemap({
            data:csv,
            tileWidth: layer.__gridSize,
            tileHeight: layer.__gridSize
        });
        var csv = layer.intGridCsv;
        let csvcopy = [];
        csv.forEach(element => {
            csvcopy.push(element);
        });
        const newArr = [];
        while(csvcopy.length) newArr.push(csvcopy.splice(0, layer.__cWid));

        map = this.scene.make.tilemap({
            data:newArr,
            tileWidth: layer.__gridSize,
            tileHeight: layer.__gridSize
        });

        let ti = map.addTilesetImage(tileset);
        return map.createLayer(0, ti, 0,0).setVisible(false);
    }
}

export class LDtkMapPack {
    collideLayer:Phaser.Tilemaps.TilemapLayer;
    displayLayers:Array<Phaser.Tilemaps.TilemapLayer>;
    entityLayers:LayerInstance;
    bgColor:string;
    settings:LevelFieldInstance[];

    constructor() {
        this.displayLayers = [];
    }

    dispose() {
        this.collideLayer.destroy();
        this.displayLayers.forEach(element => {
            element.destroy();
        });
    }
}

export interface iLDtk {
    __header__:          Header;
    jsonVersion:         string;
    nextUid:             number;
    worldLayout:         string;
    worldGridWidth:      number;
    worldGridHeight:     number;
    defaultPivotX:       number;
    defaultPivotY:       number;
    defaultGridSize:     number;
    defaultLevelWidth:   number;
    defaultLevelHeight:  number;
    bgColor:             string;
    defaultLevelBgColor: BgColor;
    minifyJson:          boolean;
    externalLevels:      boolean;
    exportTiled:         boolean;
    imageExportMode:     ImageExportMode;
    pngFilePattern:      null;
    backupOnSave:        boolean;
    backupLimit:         number;
    levelNamePattern:    string;
    flags:               any[];
    defs:                Defs;
    levels:              Level[];
}

export interface Header {
    fileType:   string;
    app:        string;
    doc:        string;
    schema:     string;
    appAuthor:  string;
    appVersion: string;
    url:        string;
}

export enum BgColor {
    The000000 = "#000000",
}

export interface Defs {
    layers:        Layer[];
    entities:      Entity[];
    tilesets:      Tileset[];
    enums:         Enum[];
    externalEnums: any[];
    levelFields:   LevelField[];
}

export interface Entity {
    identifier:      EntityIdentifier;
    uid:             number;
    tags:            any[];
    width:           number;
    height:          number;
    resizableX:      boolean;
    resizableY:      boolean;
    keepAspectRatio: boolean;
    fillOpacity:     number;
    lineOpacity:     number;
    hollow:          boolean;
    color:           string;
    renderMode:      string;
    showName:        boolean;
    tilesetId:       null;
    tileId:          null;
    tileRenderMode:  string;
    maxCount:        number;
    limitScope:      string;
    limitBehavior:   string;
    pivotX:          number;
    pivotY:          number;
    fieldDefs:       FieldDef[];
}

export interface FieldDef {
    identifier:          FieldDefIdentifier;
    __type:              Type;
    uid:                 number;
    type:                TypeClass | string;
    isArray:             boolean;
    canBeNull:           boolean;
    arrayMinLength:      null;
    arrayMaxLength:      null;
    editorDisplayMode:   string;
    editorDisplayPos:    string;
    editorAlwaysShow:    boolean;
    editorCutLongValues: boolean;
    min:                 null;
    max:                 null;
    regex:               null;
    acceptFileTypes:     null;
    defaultOverride:     DefaultOverride | null;
    textLanguageMode:    null;
}

export enum Type {
    Bool = "Bool",
    Color = "Color",
    Float = "Float",
    Int = "Int",
    LocalEnumDirection = "LocalEnum.Direction",
    LocalEnumPosition = "LocalEnum.Position",
    String = "String",
}

export interface DefaultOverride {
    id:     string;
    params: Array<number | string>;
}

export enum FieldDefIdentifier {
    Flag = "Flag",
}

export interface TypeClass {
    id:     string;
    params: number[];
}

export enum EntityIdentifier {
    NinjaStart = "NinjaStart",
    Flag = 'Flag',
    Soldier = 'Soldier',
    Blade = 'Blade'
}

export interface Enum {
    identifier:           FieldDefIdentifier;
    uid:                  number;
    values:               ValueElement[];
    iconTilesetUid:       null;
    externalRelPath:      null;
    externalFileChecksum: null;
}

export interface ValueElement {
    id:            string;
    tileId:        null;
    color:         number;
    __tileSrcRect: null;
}

export interface Layer {
    __type:                TypeEnum;
    identifier:            LayerIdentifier;
    type:                  TypeEnum;
    uid:                   number;
    gridSize:              number;
    displayOpacity:        number;
    pxOffsetX:             number;
    pxOffsetY:             number;
    requiredTags:          any[];
    excludedTags:          any[];
    intGridValues:         IntGridValue[];
    autoTilesetDefUid:     number | null;
    autoRuleGroups:        AutoRuleGroup[];
    autoSourceLayerDefUid: number | null;
    tilesetDefUid:         number | null;
    tilePivotX:            number;
    tilePivotY:            number;
}

export enum TypeEnum {
    AutoLayer = "AutoLayer",
    Entities = "Entities",
    IntGrid = "IntGrid",
    Tiles = "Tiles",
}

export interface AutoRuleGroup {
    uid:        number;
    name:       string;
    active:     boolean;
    collapsed:  boolean;
    isOptional: boolean;
    rules:      Rule[];
}

export interface Rule {
    uid:              number;
    active:           boolean;
    size:             number;
    tileIds:          number[];
    chance:           number;
    breakOnMatch:     boolean;
    pattern:          number[];
    flipX:            boolean;
    flipY:            boolean;
    xModulo:          number;
    yModulo:          number;
    checker:          ImageExportMode;
    tileMode:         TileMode;
    pivotX:           number;
    pivotY:           number;
    outOfBoundsValue: null;
    perlinActive:     boolean;
    perlinSeed:       number;
    perlinScale:      number;
    perlinOctaves:    number;
}

export enum ImageExportMode {
    None = "None",
}

export enum TileMode {
    Single = "Single",
}

export enum LayerIdentifier {
    Bg = "Bg",
    Collision = "Collision",
    Entities = "Entities",
    Fg = "Fg",
    Mg = "Mg",
}

export interface IntGridValue {
    value:      number;
    identifier: null | string;
    color:      string;
}

export interface LevelField {
    identifier:          LevelFieldIdentifier;
    __type:              Type;
    uid:                 number;
    type:                string;
    isArray:             boolean;
    canBeNull:           boolean;
    arrayMinLength:      null;
    arrayMaxLength:      null;
    editorDisplayMode:   string;
    editorDisplayPos:    string;
    editorAlwaysShow:    boolean;
    editorCutLongValues: boolean;
    min:                 null;
    max:                 null;
    regex:               null;
    acceptFileTypes:     null;
    defaultOverride:     DefaultOverrideElement;
    textLanguageMode:    null;
}

export interface DefaultOverrideElement {
    id:     ID;
    params: string[];
}

export enum ID {
    VBool = "V_Bool",
    VInt = "V_Int",
    VString = "V_String",
}

export enum LevelFieldIdentifier {
    Flag = "Flag",
    Level_Goal = "Level_Goal",
    Kill_Soldiers = 'Kill_Soldiers',
    LevelNum = 'LevelNum',
    Level_Name = 'Level_Name'
}

export interface Tileset {
    __cWid:            number;
    __cHei:            number;
    identifier:        TypeEnum;
    uid:               number;
    relPath:           RelPath;
    pxWid:             number;
    pxHei:             number;
    tileGridSize:      number;
    spacing:           number;
    padding:           number;
    tagsSourceEnumUid: null;
    enumTags:          any[];
    customData:        any[];
    savedSelections:   any[];
    cachedPixelData:   CachedPixelData;
}

export interface CachedPixelData {
    opaqueTiles:   string;
    averageColors: string;
}

export enum RelPath {
    TilesetPNG = "tileset.png",
}

export interface Level {
    identifier:        string;
    uid:               number;
    worldX:            number;
    worldY:            number;
    pxWid:             number;
    pxHei:             number;
    __bgColor:         BgColor;
    bgColor:           null;
    useAutoIdentifier: boolean;
    bgRelPath:         null;
    bgPos:             null;
    bgPivotX:          number;
    bgPivotY:          number;
    __bgPos:           null;
    externalRelPath:   null;
    fieldInstances:    LevelFieldInstance[];
    layerInstances:    LayerInstance[];
    __neighbours:      any[];
}

export interface LevelFieldInstance {
    __identifier:     LevelFieldIdentifier;
    __value:          string;
    __type:           Type;
    defUid:           number;
    realEditorValues: DefaultOverrideElement[];
}

export interface LayerInstance {
    __identifier:       LayerIdentifier;
    __type:             TypeEnum;
    __cWid:             number;
    __cHei:             number;
    __gridSize:         number;
    __opacity:          number;
    __pxTotalOffsetX:   number;
    __pxTotalOffsetY:   number;
    __tilesetDefUid:    number | null;
    __tilesetRelPath:   RelPath | null;
    levelId:            number;
    layerDefUid:        number;
    pxOffsetX:          number;
    pxOffsetY:          number;
    visible:            boolean;
    optionalRules:      any[];
    intGrid:            IntGrid[];
    intGridCsv:         number[];
    autoLayerTiles:     Tile[];
    seed:               number;
    overrideTilesetUid: null;
    gridTiles:          Tile[];
    entityInstances:    EntityInstance[];
}

export interface Tile {
    px:  number[];
    src: number[];
    f:   number;
    t:   number;
    d:   number[];
}

export interface EntityInstance {
    __identifier:   EntityIdentifier;
    __grid:         number[];
    __pivot:        number[];
    __tile:         null;
    width:          number;
    height:         number;
    defUid:         number;
    px:             number[];
    fieldInstances: EntityInstanceFieldInstance[];
}

export interface EntityInstanceFieldInstance {
    __identifier:     FieldDefIdentifier;
    __value:          boolean | number | string;
    __type:           Type;
    defUid:           number;
    realEditorValues: RealEditorValue[];
}

export interface RealEditorValue {
    id:     ID;
    params: Array<boolean | number | string>;
}

export interface IntGrid {
    coordId: number;
    v:       number;
}
