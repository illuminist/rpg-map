import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import { useMapDef } from 'store/game'
import { useEditorState } from 'store/store'
import { Position } from 'maptype'
import { useDispatch, useStore } from 'react-redux'
import editor from 'store/editor'
import GridOverlay from 'components/GridOverlay'
import { GridPointerEventHandler } from 'components/GridOverlay/GridOverlay'
import useGlobalEvent from 'hooks/useGlobalEvent'

export interface MapEditorOverlayProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
}

export const MapEditorOverlay: React.FC<MapEditorOverlayProps> = (props) => {
  const { className } = props

  const dispatch = useDispatch()
  const gridSize = useMapDef((state) => state.gridSize)
  const gridCount = useMapDef((state) => state.gridCount)
  const workingLayerId = useEditorState((state) => state.workingLayer)
  const layerDef = useMapDef((state) =>
    workingLayerId ? state.layerDefs[workingLayerId] : null,
  )
  const classes = useStyles({ gridSize })

  const store = useStore()

  const [hoverAt, setHoverAt] = React.useState<null | Position>(null)
  const [mouseDownAt, setMouseDownAt] = React.useState<Position | null>(null)

  const selected = useEditorState(
    (state) => state.panel.tilemapLayerEditor.selected,
  )

  const highlight = React.useMemo(
    () => ({
      ...selected,
      ...hoverAt,
    }),
    [selected, hoverAt],
  )

  const tilesetDef = useMapDef((state) => state.tilesetDefs)
  useGlobalEvent('mouseup', (e) => e.button === 0 && setMouseDownAt(null), [])

  const moveTargetGrid = React.useCallback<GridPointerEventHandler>(
    (p, e) => {
      const pos = p.grid
      if (pos) {
        setHoverAt(pos)

        if (mouseDownAt && layerDef?.type === 'tilemap' && workingLayerId) {
          const tileGridCount =
            typeof layerDef.tileset === 'string'
              ? tilesetDef[layerDef.tileset].gridCount
              : 'gridCount' in layerDef.tileset
              ? layerDef.tileset.gridCount
              : store.getState().resource.tileset?.[layerDef.tileset.src]
                  ?.gridCount

          dispatch(
            editor.actions.paintTileLayer({
              layerId: workingLayerId,
              position: pos,
              startingPosition: mouseDownAt,
              tileGridCount,
            }),
          )
        }
      }
    },
    [mouseDownAt, layerDef, workingLayerId, tilesetDef],
  )

  const handleMouseDown = React.useCallback<GridPointerEventHandler>(
    (p, e) => {
      const pos = p.grid
      if (
        e.button === 0 &&
        workingLayerId &&
        pos &&
        layerDef?.type === 'tilemap'
      ) {
        setMouseDownAt(pos)

        const tileGridCount =
          typeof layerDef.tileset === 'string'
            ? tilesetDef[layerDef.tileset].gridCount
            : 'gridCount' in layerDef.tileset
            ? layerDef.tileset.gridCount
            : store.getState().resource.tileset?.[layerDef.tileset.src]
                ?.gridCount

        dispatch(
          editor.actions.paintTileLayer({
            layerId: workingLayerId,
            position: pos,
            startingPosition: pos,
            tileGridCount,
          }),
        )
      }
    },
    [layerDef, workingLayerId, tilesetDef],
  )

  return (
    layerDef && (
      <div
        draggable={false}
        className={classNames(className, classes.root, classes.gridContainer)}>
        <GridOverlay
          gridCount={gridCount}
          gridSize={gridSize}
          onGridPointerDown={handleMouseDown}
          onGridPointerMove={moveTargetGrid}
          highlight={highlight}
        />
      </div>
    )
  )
}

MapEditorOverlay.defaultProps = {}

export default MapEditorOverlay
