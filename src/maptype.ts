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

export type ImageLayer = {
  type: 'image'
  src: string
}

export type ObjectLayer = {
  type: 'object'
  walkable: { src: string } | Map2D<number>
}

export type TilemapLayer = {
  type: 'tilemap'
}

export type GameObject = {
  sprite: string
  layer: string
  position: Position
  stat: {
    movementRange?: number
  }
}

export type Sprite = {
  type: 'image'
  src: string
}

export type AllLayer = ImageLayer | ObjectLayer | TilemapLayer

export type MapType = {
  gridCount: Size2D
  gridSize: Size2D
  layerOrder: string[]
  layerDefs: { [layerId: string]: AllLayer }

  objectDefs: { [objectId: string]: GameObject }
  spriteDefs: { [spriteId: string]: Sprite }
}
export default MapType
