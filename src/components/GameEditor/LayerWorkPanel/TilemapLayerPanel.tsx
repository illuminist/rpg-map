import _ from 'lodash'
import * as React from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import { TilemapLayer, TilesetDef, Size2D, Position } from 'maptype'
import { useDispatch, useSelector } from 'react-redux'
import resource from 'store/resource'
import { useEditorState } from 'store/store'
import makeStyles from 'theme/makeStyles'
import clsx from 'clsx'
import editor from 'store/editor'
import ZoomInput from 'components/ZoomInput'
import GridOverlay from 'components/GridOverlay'
import { GridPointerEventHandler } from 'components/GridOverlay/GridOverlay'
import useGlobalEvent from 'hooks/useGlobalEvent'
import { useMapDef } from 'store/game'
import { getTransparentImageHash } from 'helpers/imageUtils'
import makeUrl from 'helpers/makeUrl'

const useStyles = makeStyles<{ gridSize?: Size2D; zoom: number }>(
  (theme) => ({
    imageContainer: {
      maxWidth: '100%',
      overflow: 'auto',
      position: 'relative',
    },
    tile: {
      borderRightStyle: 'dashed',
      borderBottomStyle: 'dashed',
      borderWidth: 1,
      borderColor: 'rgba(255,0,255,0.4)',
      position: 'absolute',
    },
    disableElementSelect: {
      userSelect: 'none',
    },
    tileSize: ({ gridSize }) => {
      return {
        width: gridSize?.width,
        height: gridSize?.height,
      }
    },
    tileSelected: {
      border: 'solid yellow 1px !important',
    },
    contentScale: ({ zoom }) => {
      return {
        transform: `scale(${zoom})`,
        transformOrigin: '0 0',
      }
    },
    divider: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
  { index: 1 },
)

function TilemapLayerEditor({ layerId }: { layerId: string }) {
  const layerDef = useEditorState(
    (state) => state.mapDef!.layerDefs[layerId],
  ) as TilemapLayer

  const tilesetId =
    typeof layerDef.tileset === 'string'
      ? layerDef.tileset
      : 'src' in layerDef.tileset
      ? layerDef.tileset.src
      : 'local'
  const dispatch = useDispatch()
  const tileResource = useMapDef(
    (state) => state.tilesetDefs?.[tilesetId],
  ) as TilesetDef
  const imgSrc = tileResource?.image?.src

  const processedImage = useSelector(
    (state) =>
      imgSrc &&
      state.resource.image?.[getTransparentImageHash(tileResource.image)],
  )

  const finalImageSrc = makeUrl(processedImage || imgSrc)

  React.useEffect(() => {
    if (!processedImage && tileResource?.image?.transparentColor) {
      dispatch(resource.actions.processImage(tileResource?.image))
    }
  }, [processedImage, tileResource?.image])

  const [zoom, setZoom] = React.useState(1)

  const classes = useStyles({ ...tileResource, zoom })

  const selectedTiles = useEditorState(
    (state) => state.panel.tilemapLayerEditor.selected,
  )

  const tilesetDefs = useEditorState((state) => state.mapDef?.tilesetDefs)

  const [mouseDownAt, setMouseDown] = React.useState<Position | null>(null)
  const handleTileMouseDown = React.useCallback<GridPointerEventHandler>(
    (p, e) => {
      const pos = p.grid
      if (pos) {
        setMouseDown(pos)
      }
    },
    [],
  )

  const handleTileClick = React.useCallback<GridPointerEventHandler>((p, e) => {
    const pos = p.grid
    if (pos) {
      dispatch(
        editor.actions.setProperty(
          ['panel', 'tilemapLayerEditor', 'selected'],
          { ...pos, width: 1, height: 1 },
        ),
      )
    }
  }, [])

  const handleTileMouseEnter = React.useCallback<GridPointerEventHandler>(
    (p, e) => {
      const pos = p.grid

      if (pos && mouseDownAt) {
        const startPos = {
          x: Math.min(mouseDownAt.x, pos.x),
          y: Math.min(mouseDownAt.y, pos.y),
        }
        const size = {
          width: Math.max(
            1,
            Math.abs(
              startPos.x - (pos.x > mouseDownAt.x ? pos.x : mouseDownAt.x) - 1,
            ),
          ),
          height: Math.max(
            1,
            Math.abs(
              startPos.y - (pos.y > mouseDownAt.y ? pos.y : mouseDownAt.y) - 1,
            ),
          ),
        }
        dispatch(
          editor.actions.setProperty(
            ['panel', 'tilemapLayerEditor', 'selected'],
            { ...startPos, ...size },
          ),
        )
      }
    },
    [mouseDownAt],
  )

  useGlobalEvent('mouseup', () => setMouseDown(null), [])

  const handleMenuSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.value) {
      case '$import':
        dispatch(editor.actions.openDialog({ dialog: 'tilesetImporter' }))
        return
      case '$create':
        dispatch(editor.actions.openDialog({ dialog: 'tilesetProperty' }))
        return
      case undefined:
        return
      default:
        dispatch(
          editor.actions.setLayerProperty({
            layerId,
            property: ['tileset'],
            value: e.target.value,
          }),
        )
    }
  }

  return (
    <>
      <TextField
        fullWidth
        label="Tileset ID"
        value={tilesetId}
        select
        onChange={handleMenuSelect}>
        {_.map(tilesetDefs, (t, id) => (
          <MenuItem key={id} value={id}>
            {t.localName || 'unnamed tileset'}
          </MenuItem>
        ))}
        <Divider className={classes.divider} />
        <MenuItem value="$import">Import tileset</MenuItem>
        <MenuItem value="$create">Create new tileset</MenuItem>
      </TextField>
      {tileResource && (
        <>
          <div
            className={clsx(
              classes.imageContainer,
              classes.disableElementSelect,
            )}>
            <div className={classes.contentScale}>
              <GridOverlay
                gridCount={tileResource.gridCount}
                gridSize={tileResource.gridSize}
                onGridClick={handleTileClick}
                onGridPointerMove={handleTileMouseEnter}
                onGridPointerDown={handleTileMouseDown}
                highlight={selectedTiles}>
                <img src={finalImageSrc} alt={tilesetId} />
              </GridOverlay>
            </div>
          </div>
          <Toolbar>
            <ZoomInput onChange={(v) => setZoom(v)} value={zoom} />
          </Toolbar>
        </>
      )}
    </>
  )
}

export default TilemapLayerEditor
