import _ from 'lodash'
import { MapType, Position, Map2D, ObjectLayer } from 'maptype'
import { createAction, createReducer, createAsyncThunk } from '@reduxjs/toolkit'
import produce from 'immer'
import { ThunkConfig, RootState } from './store'
import makeUrl from 'helpers/makeUrl'

export type GameType = {
  selected: string | null
  animating: boolean
  loaded: boolean
  moveableDisplay: { [poscoordinate: string]: true } | null
} & MapType

const positionAround = (position: Position) => {
  return [
    { x: position.x + 1, y: position.y },
    { x: position.x - 1, y: position.y },
    { x: position.x, y: position.y - 1 },
    { x: position.x, y: position.y + 1 },
  ]
}

const posToString = (position: Position) => {
  return position.x + ',' + position.y
}

export const initMap = createAsyncThunk<MapType, MapType, ThunkConfig>(
  'initMap',
  async (arg, { dispatch }) => {
    await dispatch(prepareWalkableLayer())
    // const finalMap = produce(arg, (d) => {
    //   Object.keys(wks).forEach((id) => {
    //     ;(d.layerDefs[id] as ObjectLayer).walkable = wks[id]
    //   })
    // })
    // return finalMap
    return arg
  },
)

export const selectObject = createAction<string>('selectObject')
export const deselectObject = createAction<string>('deselectObject')
export const moveObject = createAction<{
  objectId: string
  destination: Position
}>('moveObject')
export const walkObject = createAsyncThunk<
  void,
  {
    objectId?: string
    destination: Position
  },
  ThunkConfig
>('walkObject', async (arg, { dispatch, getState }) => {
  // TODO determine path, d

  const state = getState() as RootState
  const withId = {
    ...arg,
    objectId: 'objectId' in arg ? arg.objectId! : state.map.selected!,
  }

  dispatch(moveObject(withId))
})

const prepareWalkableLayer = createAsyncThunk<
  { [id: string]: Map2D<number> },
  void,
  ThunkConfig
>('prepareWalkableLayer', async (arg, { getState }) => {
  const map = (getState() as RootState).map!
  const loaded: { [id: string]: Map2D<number> } = {}

  await Promise.all(
    Object.keys(map.layerDefs).map(
      (layerId) =>
        new Promise((resolve) => {
          const layerDef = map.layerDefs[layerId] as ObjectLayer
          if (layerDef.walkable && 'src' in layerDef.walkable) {
            const img = document.createElement('img')
            img.src = makeUrl(layerDef.walkable.src)
            img.onload = () => {
              const canvas = document.createElement('canvas')
              canvas.width = img.width
              canvas.height = img.height
              const ctx = canvas.getContext('2d')
              if (!ctx) throw new Error('not-support-canvas')
              ctx.drawImage(img, 0, 0, img.width, img.height)

              const wk = _.times(map.gridCount.height, (y) =>
                _.times(map.gridCount.width, (x) => {
                  const px = ctx.getImageData(
                    x * map.gridSize.width + map.gridSize.width / 2,
                    y * map.gridSize.height + map.gridSize.height / 2,
                    1,
                    1,
                  ).data
                  return px[0] ? 0 : 1
                }),
              )
              loaded[layerId] = wk
              resolve()
            }
          } else {
            resolve()
          }
        }),
    ),
  )
  return loaded
})

export const gameReducer = createReducer<GameType>(null as any, (builder) =>
  builder
    .addCase(initMap.pending, (state, action) => {
      return {
        ..._.cloneDeep(action.meta.arg),
        selected: null,
        animating: false,
        moveableDisplay: null,
        loaded: false,
      }
    })
    .addCase(initMap.fulfilled, (state, action) => {
      state.loaded = true
    })
    .addCase(prepareWalkableLayer.fulfilled, (state, action) => {
      console.log(action)
      Object.keys(action.payload).forEach((id) => {
        ;(state.layerDefs[id] as ObjectLayer).walkable = action.payload[id]
      })
    })
    .addCase(selectObject, (state, action) => {
      const gameObject = state.objectDefs[action.payload]
      if (!gameObject?.stat.movementRange) return
      state.selected = action.payload
      state.moveableDisplay = {}

      const visited = new Map<string, number>()
      visited.set(posToString(gameObject.position), Number.POSITIVE_INFINITY)

      const traverse = (position: Position, range: number) => {
        if (range <= 0) return

        if (
          !visited.has(posToString(position)) ||
          visited.get(posToString(position))! > range
        ) {
          visited.set(posToString(position), range)
          if (true) {
            state.moveableDisplay![posToString(position)] = true
          }
          positionAround(position)
            .filter((p) => !visited.has(posToString(p)))
            .forEach((p) => traverse(p, range - 1))
        }
      }
      positionAround(gameObject.position).forEach((p) =>
        traverse(p, gameObject.stat.movementRange!),
      )
    })
    .addCase(deselectObject, (state, action) => {
      state.selected = null
      state.moveableDisplay = null
    })
    .addCase(moveObject, (state, action) => {
      state.objectDefs[action.payload.objectId].position =
        action.payload.destination
      state.selected = null
      state.moveableDisplay = null
    })
    .addCase(walkObject.pending, (state, action) => {
      state.animating = true
    })
    .addCase(walkObject.fulfilled, (state, action) => {
      state.animating = false
    }),
)
