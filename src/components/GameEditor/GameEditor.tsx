import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import MapType from 'maptype'
import GameMap from 'components/GameMap'
import Drawer from '@material-ui/core/Drawer'
import LayerPanel from './LayerPanel'
import { useEditorState } from 'store/store'
import { useDispatch } from 'react-redux'
import editor from 'store/editor'
import LayerWorkPanel from './LayerWorkPanel'
import MapEditorOverlay from './MapEditorOverlay'
import MenuPanel from './MenuPanel'
import TilesetPropertyDialog from './TilesetPropertyDialog'
import TilesetImporterDialog from './TilesetImporterDialog'

export interface GameEditorProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  mapDef: MapType
}

export const GameEditor: React.FC<GameEditorProps> = (props) => {
  const classes = useStyles(props)
  const { className, mapDef } = props

  const editorMapDef = useEditorState((state) => state.mapDef)
  const isEditing = useEditorState((state) => state.isEditing)
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (!editorMapDef) {
      dispatch(editor.actions.initialize({ mapDef }))
    }
  }, [mapDef, editorMapDef])

  return isEditing && editorMapDef ? (
    <div className={classNames(className, classes.root)}>
      <GameMap mapDef={editorMapDef} overlay={<MapEditorOverlay />} />
      <Drawer
        classes={{ paper: classes.drawerPaper }}
        open
        variant="permanent"
        anchor="right">
        <LayerPanel />
      </Drawer>
      <Drawer
        classes={{ paper: classes.drawerPaper }}
        open
        variant="permanent"
        anchor="left">
        <MenuPanel />
        <LayerWorkPanel />
      </Drawer>
      <TilesetPropertyDialog />
      <TilesetImporterDialog />
    </div>
  ) : null
}

GameEditor.defaultProps = {}

export default GameEditor
