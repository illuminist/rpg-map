export type Size2D = {
  width: number
  height: number
}

export type Map2D<T> = {
  [y: number]: { [x: number]: T }
}

export type Position = {
  x: number
  y: number
}

export type Rect = Size2D & Position

export type BaseLayer = {
  localName?: string
}

export type ImageLayer = BaseLayer & {
  type: 'image'
  src: string
  offset: Position
  scale: Size2D
}

export type ObjectLayer = BaseLayer & {
  type: 'object'
  walkable: { src: string } | Map2D<number>
}

export type TilesetTileDef = {
  animation?: { frames: number[]; frametime: number }
}

export type TilesetDef = {
  localName?: string
  gridCount: Size2D
  gridSize: Size2D
  offset: Position
  image: { src: string; transparentColor?: string[] }
  tileDefs: {
    [id: number]: TilesetTileDef
  }
}

export type TilemapLayer = BaseLayer & {
  type: 'tilemap'
  tileset: { src: string } | TilesetDef | string
  tiles: Map2D<number>
}

export type GameObject = {
  sprite: string
  layer: string
  position: Position
  group?: number
  stat: {
    movementRange?: number
  }
}

export type Sprite = {
  type: 'image'
  src: string
}

export type AllLayer = ImageLayer | ObjectLayer | TilemapLayer
export type LayerType = AllLayer['type']

export type MapType = {
  gridCount: Size2D
  gridSize: Size2D
  layerOrder: string[]
  layerDefs: { [layerId: string]: AllLayer }
  tilesetDefs: { [tilesetId: string]: TilesetDef }
  objectDefs: { [objectId: string]: GameObject }
  spriteDefs: { [spriteId: string]: Sprite }
}
export default MapType
