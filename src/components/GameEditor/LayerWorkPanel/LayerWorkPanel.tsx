import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import PanelBase from '../PanelBase'
import { useEditorState } from 'store/store'
import { ImageLayer, LayerType, TilemapLayer, AllLayer } from 'maptype'
import EditorTextField from 'components/EditorTextField'
import { useDispatch } from 'react-redux'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import editor from 'store/editor'
import TilemapLayerEditor from './TilemapLayerPanel'

export interface LayerWorkPanelProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
}

export const layerEditorComponent: Record<
  LayerType,
  React.ComponentType<{ layerId: string }>
> = {
  image: function ImageLayerEditor({ layerId }) {
    const layerDef = useEditorState(
      (state) => state.mapDef!.layerDefs[layerId],
    ) as ImageLayer
    const dispatch = useDispatch()
    const handleSrcChange = (e: string) => {
      dispatch(
        editor.actions.setLayerProperty({ layerId, property: 'src', value: e }),
      )
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        editor.actions.setLayerProperty({
          layerId,
          property: e.target.name,
          value: Number(e.target.value),
        }),
      )
    }

    return (
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <EditorTextField
              fullWidth
              label="Image src"
              value={layerDef.src}
              onUpdate={handleSrcChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              inputProps={{ step: 0.1 }}
              value={layerDef.offset.x}
              label="Offset X"
              onChange={handleChange}
              name="offset.x"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              inputProps={{ step: 0.1 }}
              value={layerDef.offset.y}
              label="Offset Y"
              onChange={handleChange}
              name="offset.y"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              inputProps={{ step: 0.1 }}
              value={layerDef.scale.width}
              label="Scale width"
              onChange={handleChange}
              name="scale.width"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              inputProps={{ step: 0.1 }}
              value={layerDef.scale.height}
              label="Scale height"
              onChange={handleChange}
              name="scale.height"
            />
          </Grid>
        </Grid>
      </CardContent>
    )
  },
  object: function ObjectLayerEditor({ layerId }) {
    const layerDef = useEditorState(
      (state) => state.mapDef!.layerDefs[layerId],
    ) as ImageLayer
    return (
      <>
        <EditorTextField label="Image src" value={layerDef.src} />
      </>
    )
  },
  tilemap: TilemapLayerEditor,
}

export const LayerWorkPanel: React.FC<LayerWorkPanelProps> = (props) => {
  const classes = useStyles(props)
  const { className } = props

  const workingLayer = useEditorState((state) => state.workingLayer)
  const layerDef = useEditorState(
    (state) =>
      state.workingLayer && state.mapDef!.layerDefs[state.workingLayer],
  ) as AllLayer
  const LayerEditor = layerEditorComponent[layerDef?.type]
  return (
    <PanelBase
      title={'Working on ' + (layerDef?.localName || '' + workingLayer)}>
      {LayerEditor && <LayerEditor layerId={workingLayer!} />}
    </PanelBase>
  )
}

LayerWorkPanel.defaultProps = {}

export default LayerWorkPanel
