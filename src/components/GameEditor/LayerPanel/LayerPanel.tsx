import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import PanelBase from '../PanelBase'
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import CardActions from '@material-ui/core/CardActions'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import { useEditorState } from 'store/store'
import { useDispatch } from 'react-redux'
import editor from 'store/editor'
import AddIcon from '@material-ui/icons/Add'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import DeleteIcon from '@material-ui/icons/Delete'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { LayerType } from 'maptype'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'

export interface LayerPanelProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
}

const VisibilityCheckbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (props, ref) => (
    <Checkbox
      ref={ref}
      checkedIcon={<VisibilityIcon />}
      icon={<VisibilityOffIcon />}
      {...props}
    />
  ),
)

export const LayerPanel: React.FC<LayerPanelProps> = (props) => {
  const classes = useStyles(props)
  const { className } = props

  const mapDef = useEditorState((state) => state.mapDef)
  const workingLayer = useEditorState((state) => state.workingLayer)
  const hiddenLayer = useEditorState((state) => state.hiddenLayer)
  const dispatch = useDispatch()
  const handleLayerSelect = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const layerId = e.currentTarget.dataset.layerid
      if (layerId) dispatch(editor.actions.selectWorkingLayer({ layerId }))
    },
    [],
  )

  const [menuOpen, setMenuOpen] = React.useState(false)
  const addMenuAnchorRef = React.useRef<HTMLButtonElement>(null)
  const handleAddLayer = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setMenuOpen(false)
      const layerType = e.currentTarget.dataset.layertype as LayerType

      if (layerType)
        dispatch(
          editor.actions.addLayer({
            layerType,
          }),
        )
    },
    [],
  )

  const handleDelete = React.useCallback(() => {
    workingLayer &&
      dispatch(editor.actions.deleteLayer({ layerId: workingLayer }))
  }, [workingLayer])

  const handleRearrage = (result: DropResult) => {
    if (result.destination) {
      dispatch(
        editor.actions.rearrangeLayer({
          sourceIndex: mapDef!.layerOrder.length - result.source.index - 1,
          targetIndex: mapDef!.layerOrder.length - result.destination.index - 1,
        }),
      )
    }
  }

  const handleHidden = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const t = e.currentTarget
      const layerId = t.dataset.layerid
      if (layerId)
        dispatch(
          editor.actions.hideLayer({ layerId: layerId, hidden: !t.checked }),
        )
    },
    [],
  )

  return (
    <DragDropContext onDragEnd={handleRearrage}>
      <PanelBase title="Layer">
        <Droppable droppableId="layerpanel" type="LAYER">
          {(dropProvided, snapshot) => {
            return (
              <List
                className={classes.center}
                ref={dropProvided.innerRef}
                {...dropProvided.droppableProps}>
                {mapDef?.layerOrder &&
                  [...mapDef.layerOrder].reverse().map((layerId, index) => (
                    <Draggable
                      key={layerId}
                      draggableId={layerId}
                      index={index}>
                      {(dragProvided, snapshot) => (
                        <ListItem
                          button
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          data-layerid={layerId}
                          selected={workingLayer === layerId}
                          onClick={handleLayerSelect}
                          divider>
                          <ListItemText
                            inset
                            secondary={mapDef.layerDefs[layerId].type}>
                            {mapDef.layerDefs[layerId]?.localName || layerId}
                          </ListItemText>

                          <span {...dragProvided.dragHandleProps}>
                            <DragHandleIcon />
                          </span>
                          <ListItemSecondaryAction
                            style={{ left: 16, right: 'unset' }}>
                            <VisibilityCheckbox
                              color="default"
                              inputProps={{ 'data-layerid': layerId } as any}
                              checked={!hiddenLayer[layerId]}
                              onChange={handleHidden}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                {dropProvided.placeholder}
              </List>
            )
          }}
        </Droppable>
        <Menu
          open={menuOpen}
          anchorEl={addMenuAnchorRef.current}
          onClose={() => setMenuOpen(false)}>
          {/* <MenuItem data-layertype="object" onClick={handleAddLayer}>
            Object
          </MenuItem> */}
          <MenuItem data-layertype="image" onClick={handleAddLayer}>
            Image
          </MenuItem>
          <MenuItem data-layertype="tilemap" onClick={handleAddLayer}>
            Tilemap
          </MenuItem>
        </Menu>
        <CardActions>
          <IconButton ref={addMenuAnchorRef} onClick={() => setMenuOpen(true)}>
            <AddIcon />
          </IconButton>
          <IconButton disabled={!workingLayer} onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </PanelBase>
    </DragDropContext>
  )
}

LayerPanel.defaultProps = {}

export default LayerPanel
