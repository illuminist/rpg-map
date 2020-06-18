import _ from 'lodash'
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import MapType, {
  ImageLayer,
  Rect,
  Position,
  TilemapLayer,
  Size2D,
  TilesetDef,
  LayerType,
} from 'maptype'
import { v4 as uuidv4 } from 'uuid'
import { times2D } from 'helpers/extralodash'
import { loadDataResource } from 'helpers/resourceUtils'
import { RootState } from './store'

export type EditorState = {
  workingLayer: string | null
  mapDef: MapType | null
  isEditing: boolean
  panel: {
    tilemapLayerEditor: {
      selected: Rect
      paintMode: 'paint'
    }
  }
  updatedTiles: {
    layerId: string
    tiles: { [tileId: string]: true }
  } | null
  dialog: { [dialogId: string]: any }
  hiddenLayer: { [layerId: string]: boolean }
}

const editorInitialState: EditorState = {
  workingLayer: null,
  mapDef: null,
  isEditing: false,
  panel: {
    tilemapLayerEditor: {
      selected: {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
      },
      paintMode: 'paint',
    },
  },
  updatedTiles: null,
  dialog: {},
  hiddenLayer: {},
}

export const importTileset = createAsyncThunk(
  'importTileset',
  async (
    arg: {
      tilesetId: string
      applyToLayer?: string | true
      localName?: string
    },
    thunk,
  ) => {
    const localId = uuidv4()
    const url = arg.tilesetId
    const applyToLayer: string | undefined =
      arg.applyToLayer === true
        ? (thunk.getState() as any).editor.workingLayer
        : arg.applyToLayer
    const data = await loadDataResource<TilesetDef>(url)
    return {
      tileDef: data,
      localId,
      localName: arg.localName || arg.tilesetId,
      applyToLayer,
    }
  },
)

const createDefaultMapDef = (): MapType => {
  const layerId = uuidv4()

  return {
    gridCount: {
      width: 36,
      height: 18,
    },
    gridSize: {
      width: 16,
      height: 16,
    },
    layerOrder: [layerId],
    layerDefs: {
      [layerId]: {
        type: 'tilemap',
        tileset: '',
        tiles: [],
      },
    },
    objectDefs: {},
    spriteDefs: {},
    tilesetDefs: {},
  }
}

export const editor = createSlice({
  name: 'editor',
  initialState: editorInitialState,
  reducers: {
    initialize: {
      prepare: (args: { mapDef?: MapType }) => {
        return {
          payload: { mapDef: args.mapDef || createDefaultMapDef() },
        }
      },
      reducer: (state, action: PayloadAction<{ mapDef: MapType }>) => {
        state.mapDef = action.payload.mapDef
        state.isEditing = true
        ;(state.mapDef as any).loaded = true
        ;(state.mapDef as any).ready = true
      },
    },

    selectWorkingLayer: (state, action: PayloadAction<{ layerId: string }>) => {
      state.workingLayer = action.payload.layerId
    },

    addLayer: {
      prepare: ({ layerType }: { layerType: LayerType }) => {
        return {
          payload: { layerType, layerId: uuidv4() },
        }
      },
      reducer: (
        state,
        action: PayloadAction<{
          layerId: string
          layerType: LayerType
        }>,
      ) => {
        const layerId = action.payload.layerId
        const mapDef = state.mapDef
        if (!mapDef) return
        mapDef.layerOrder.push(layerId)
        switch (action.payload.layerType) {
          case 'image':
            const imageLayer: ImageLayer = {
              type: 'image',
              localName: 'Image Layer',
              src: '',
              scale: { width: 1, height: 1 },
              offset: { x: 0, y: 0 },
            }
            mapDef.layerDefs[layerId] = imageLayer
            state.workingLayer = layerId
            break
          case 'tilemap':
            const tilemapLayer: TilemapLayer = {
              type: 'tilemap',
              localName: 'Tilemap Layer',
              tileset: { src: '' },
              tiles: [],
            }
            mapDef.layerDefs[layerId] = tilemapLayer
            state.workingLayer = layerId
            break
          default:
            throw new Error('not support layer type')
        }
      },
    },

    setMapProperty: (
      state,
      action: PayloadAction<{
        property: string | string[]
        value: any
      }>,
    ) => {
      if (state.mapDef)
        _.set(state.mapDef, action.payload.property, action.payload.value)
    },

    setLayerProperty: (
      state,
      action: PayloadAction<{
        layerId: string
        property: string | string[]
        value: any
      }>,
    ) => {
      const layer = state.mapDef?.layerDefs[action.payload.layerId] as any
      if (layer) _.set(layer, action.payload.property, action.payload.value)
    },

    setProperty: {
      prepare: (name: string | string[], value: any) => ({
        payload: { name, value },
        meta: {},
        error: null,
      }),
      reducer: (state, action) => {
        _.set(state, action.payload.name, action.payload.value)
      },
    },

    paintTileLayer: (
      state,
      action: PayloadAction<{
        layerId: string
        position: Position
        tileGridCount: Size2D
        startingPosition?: Position
      }>,
    ) => {
      const {
        layerId,
        position,
        tileGridCount,
        startingPosition,
      } = action.payload
      if (!state.mapDef) return
      const layer = state.mapDef.layerDefs[layerId]
      if (layer && layer.type === 'tilemap' && tileGridCount) {
        const selectTileRect = state.panel.tilemapLayerEditor.selected
        times2D(selectTileRect.width, selectTileRect.height, (dx, dy) => {
          const px = position.x + dx
          const py = position.y + dy
          if (
            px >= 0 &&
            py >= 0 &&
            px < state.mapDef!.gridCount.width &&
            py < state.mapDef!.gridCount.height
          ) {
            if (!layer.tiles[py]) {
              layer.tiles[py] = []
            }

            const newTileData =
              tileGridCount.width *
                (selectTileRect.y +
                  (startingPosition
                    ? (position.y -
                        (startingPosition.y - selectTileRect.height * 10000) +
                        dy) %
                      selectTileRect.height
                    : dy)) +
              selectTileRect.x +
              (startingPosition
                ? (position.x -
                    (startingPosition.x - selectTileRect.width * 10000) +
                    dx) %
                  selectTileRect.width
                : dx)

            layer.tiles[py][px] = newTileData
          }
        })
      }
    },

    deleteLayer: (state, action: PayloadAction<{ layerId: string }>) => {
      if (state.mapDef) {
        const layerId = action.payload.layerId
        state.mapDef.layerOrder = state.mapDef?.layerOrder.filter(
          (s) => s !== layerId,
        )
        delete state.mapDef.layerDefs[layerId]
        state.workingLayer = null
      }
    },

    createTileset: {
      prepare: ({
        tilesetDef,
        assignToLayer,
      }: {
        tilesetDef: TilesetDef
        assignToLayer?: string | true
      }) => {
        return {
          payload: { tilesetDef, tilesetId: uuidv4(), assignToLayer },
          meta: {},
          error: null,
        }
      },
      reducer: (state, action) => {
        if (state.mapDef) {
          _.set(
            state.mapDef,
            ['tilesetDefs', action.payload.tilesetId],
            action.payload.tilesetDef,
          )

          if (action.payload.assignToLayer) {
            const layerDef = state.mapDef.layerDefs[
              (action.payload.assignToLayer === true && state.workingLayer) ||
                action.payload.assignToLayer
            ] as TilemapLayer
            layerDef.tileset = action.payload.tilesetId
            return
          }
        }
      },
    },

    rearrangeLayer: (
      state,
      action: PayloadAction<{ sourceIndex: number; targetIndex: number }>,
    ) => {
      if (state.mapDef) {
        const layer = state.mapDef.layerOrder.splice(
          action.payload.sourceIndex,
          1,
        )
        state.mapDef.layerOrder.splice(action.payload.targetIndex, 0, ...layer)
      }
    },

    openDialog: (
      state,
      action: PayloadAction<{ dialog: string; props?: any }>,
    ) => {
      state.dialog[action.payload.dialog] = action.payload.props ?? true
    },

    closeDialog: (state, action: PayloadAction<{ dialog: string }>) => {
      delete state.dialog[action.payload.dialog]
    },

    hideLayer: (
      state,
      action: PayloadAction<{ layerId: string; hidden: boolean }>,
    ) => {
      if (action.payload.hidden) {
        state.hiddenLayer[action.payload.layerId] = true
      } else {
        delete state.hiddenLayer[action.payload.layerId]
      }
    },
  },

  extraReducers: (builder) =>
    (builder.addCase(importTileset.fulfilled, (state, action) => {
      if (state.mapDef) {
        _.set(state.mapDef, ['tilesetDefs', action.payload.localId], {
          ...action.payload.tileDef,
          localName: action.payload.localName,
        })
        action.payload.applyToLayer &&
          _.set(
            state.mapDef,
            ['layerDefs', action.payload.applyToLayer, 'tileset'],
            action.payload.localId,
          )
      }
    }) as unknown) as void,
})

type EditerActions = typeof editor.actions & {
  importTileset: typeof importTileset
}

editor.actions = Object.assign(editor.actions, { importTileset })

export default editor as typeof editor & { actions: EditerActions }
