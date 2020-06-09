import _ from 'lodash'
import { MapType, Position, Map2D, ObjectLayer, Size2D } from 'maptype'
import { createAction, createReducer, createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig, RootState } from './store'
import makeUrl from 'helpers/makeUrl'
import PQueue from 'js-priority-queue'
import {
  surround4,
  distance,
  posToString,
  PositionSet,
  vectorEq,
  inbound,
} from 'helpers/vectorUtils'
import { sleep } from 'helpers/promiseUtils'

export type GameType = {
  selected: string | null
  animating: boolean
  loaded: boolean
  moveableDisplay: { [poscoordinate: string]: true } | null
} & MapType

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

export const pathFind = ({
  map,
  gridCount,
  origin,
  destination,
  passthrough = 0,
  range = 1 / 0,
}: {
  map: Map2D<number>
  gridCount: Size2D
  origin: Position
  destination: Position
  passthrough?: number
  range?: number
}) => {
  const nextqueue = new PQueue<Position>({
    comparator: (a, b) => {
      const da = distance(a, destination)
      const db = distance(b, destination)
      return da - db
    },
  })

  const visited = new PositionSet()
  const fromMap = new Map<string, string>()
  const rangeMap = new Map<string, number>()
  let reached = false
  const around = surround4(origin)

  around.forEach((pos) => {
    if (
      inbound(pos, 0, 0, gridCount.width, gridCount.height) &&
      (map[pos.y][pos.x] === 0 || (map[pos.y][pos.x] ^ passthrough) === 0)
    ) {
      nextqueue.queue(pos)
      fromMap.set(posToString(pos), posToString(origin))
      rangeMap.set(posToString(pos), range)
    }
  })

  while (nextqueue.length > 0) {
    const currentPos = nextqueue.dequeue()
    if (!visited.has(currentPos)) {
      visited.add(currentPos)

      if (vectorEq(currentPos, destination)) {
        reached = true
        break
      }
      const currentRange = rangeMap.get(posToString(currentPos))
      if (currentRange == null || currentRange < 0) continue
      const around = surround4(currentPos)

      around.forEach((pos) => {
        if (
          !visited.has(pos) &&
          (map[pos.y][pos.x] === 0 || (map[pos.y][pos.x] ^ passthrough) === 0)
        ) {
          nextqueue.queue(pos)
          fromMap.set(posToString(pos), posToString(currentPos))
          rangeMap.set(posToString(pos), currentRange - 1)
        }
      })
    }
  }

  if (reached) {
    let pminus1: string | undefined = posToString(destination)
    const path: string[] = [pminus1]
    do {
      pminus1 = fromMap.get(pminus1!)
      pminus1 && path.push(pminus1)
      if (pminus1 === posToString(origin)) return path
    } while (pminus1 && fromMap.size > 0)
  }
}

export const prepareObjectWalkMap = (state: GameType, objectId: string) => {
  const gameObject = state.objectDefs[objectId]

  const layer = state.layerDefs[gameObject.layer] as ObjectLayer

  const walkmap = _.cloneDeep(layer.walkable) as Map2D<number>

  const objectsOnLayer = _.pickBy(
    state.objectDefs,
    ({ layer }) => layer === gameObject.layer,
  )

  _.forEach(objectsOnLayer, ({ group, position }) => {
    const tile = _.get(walkmap, [position.y, position.x])
    _.set(
      walkmap,
      [position.y, position.x],
      group && gameObject.group
        ? (gameObject.group ^ group) === 0
          ? group
          : 0
        : tile,
    )
  })

  return walkmap
}

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
    ignoreBlock?: boolean
    ignoreRange?: boolean
  },
  ThunkConfig
>('walkObject', async (arg, { dispatch, getState }) => {
  const state = getState() as RootState
  const objectId = 'objectId' in arg ? arg.objectId! : state.map.selected!

  const gameObject = state.map.objectDefs[objectId]
  const walkmap = prepareObjectWalkMap(state.map, objectId)

  const path = pathFind({
    map: walkmap,
    origin: gameObject.position,
    destination: arg.destination,
    passthrough: gameObject.group,
    gridCount: state.map.gridCount,
    range: gameObject.stat?.movementRange,
  })

  if (!path) {
    throw new Error('path-invalid')
  }
  while (path.length) {
    const nextMove = path.pop()!.split(',').map(Number)
    const nextPos = { x: nextMove[0], y: nextMove[1] }
    dispatch(moveObject({ destination: nextPos, objectId }))
    await sleep(300)
  }
  // dispatch(moveObject(withId))
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
        new Promise((resolve, reject) => {
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
                  return px[0] ? -1 : 0
                }),
              )
              loaded[layerId] = wk
              resolve()
            }
            img.onerror = reject
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
      Object.keys(action.payload).forEach((id) => {
        ;(state.layerDefs[id] as ObjectLayer).walkable = action.payload[id]
      })
    })
    .addCase(selectObject, (state, action) => {
      const walkmap = _.cloneDeep(prepareObjectWalkMap(state, action.payload))
      const gameObject = state.objectDefs[action.payload]
      if (!gameObject?.stat.movementRange) return
      state.selected = action.payload
      state.moveableDisplay = {}

      const visited = new PositionSet()
      const visitQueue: [Position, number][] = [
        [gameObject.position, gameObject.stat!.movementRange!],
      ]
      visited.add(gameObject.position)

      do {
        const [currentPos, currentRange = -1] = visitQueue.shift() || []
        if (!currentPos) return
        if (currentRange < 0) continue

        const tilegroup = _.get(walkmap, [currentPos.y, currentPos.x])
        if (tilegroup === 0)
          state.moveableDisplay![posToString(currentPos)] = true

        visited.add(currentPos)

        surround4(currentPos)
          .filter(
            (p) =>
              inbound(p, 0, 0, state.gridCount.width, state.gridCount.height) &&
              (_.get(walkmap, [p.y, p.x]) === 0 ||
                _.get(walkmap, [p.y, p.x]) === gameObject.group) &&
              !visited.has(p),
          )
          .forEach((p) => visitQueue.push([p, currentRange - 1]))
      } while (visitQueue.length)
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
