type Map2D<T> = {
  [y: number]: { [x: number]: T }
}

export type ImageLayer = {
  type: 'image'
  src: string
}

export type ObjectLayer = {
  type: 'object'
  walkable: Map2D<number>
}

export type TilemapLayer = {
  type: 'tilemap'
}

export type AllLayer = ImageLayer | ObjectLayer | TilemapLayer

export type MapType = {
  gridCount: {
    width: number
    height: number
  }

  gridSize: {
    width: number
    height: number
  }

  layerOrder: string[]
  layerDefs: { [layerId: string]: AllLayer }
}
export default MapType
