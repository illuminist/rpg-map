import _ from 'lodash'
import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import PanelBase from '../PanelBase'
import Button from '@material-ui/core/Button'
import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import SettingsIcon from '@material-ui/icons/Settings'
import EditorTextField from 'components/EditorTextField'
import { useDispatch, useStore } from 'react-redux'
import editor from 'store/editor'
import { useMapDef } from 'store/game'
import YAML from 'yaml'
import MapType from 'maptype'

export interface MenuPanelProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
}

const MapPropertyDialog = (props: DialogProps) => {
  const mapDef = useMapDef((s) => s) ?? null
  const dispatch = useDispatch()
  return (
    mapDef && (
      <Dialog {...props}>
        <DialogTitle>Map Properties</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <EditorTextField
                type="number"
                fullWidth
                inputProps={{ max: 1024, min: 0 }}
                name="gridSize.width"
                label="Tile width"
                value={mapDef.gridSize.width}
                onUpdate={(value) =>
                  dispatch(
                    editor.actions.setMapProperty({
                      property: 'gridSize.width',
                      value: Number(value),
                    }),
                  )
                }
              />
            </Grid>
            <Grid item xs={6}>
              <EditorTextField
                type="number"
                fullWidth
                inputProps={{ max: 1024, min: 0 }}
                name="gridSize.height"
                label="Tile height"
                value={mapDef.gridSize.height}
                onUpdate={(value) =>
                  dispatch(
                    editor.actions.setMapProperty({
                      property: 'gridSize.height',
                      value: Number(value),
                    }),
                  )
                }
              />
            </Grid>
            <Grid item xs={6}>
              <EditorTextField
                type="number"
                fullWidth
                inputProps={{ max: 100, min: 0 }}
                name="gridCount.width"
                label="Tile row"
                value={mapDef.gridCount.width}
                onUpdate={(value) =>
                  dispatch(
                    editor.actions.setMapProperty({
                      property: 'gridCount.width',
                      value: Number(value),
                    }),
                  )
                }
              />
            </Grid>
            <Grid item xs={6}>
              <EditorTextField
                type="number"
                fullWidth
                inputProps={{ max: 100, min: 0 }}
                name="gridCount.height"
                label="Tile column"
                value={mapDef.gridCount.height}
                onUpdate={(value) =>
                  dispatch(
                    editor.actions.setMapProperty({
                      property: 'gridCount.height',
                      value: Number(value),
                    }),
                  )
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose as any}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  )
}

const mapToYAML = (mapDef: MapType) =>
  YAML.stringify(_.omit(mapDef, 'loaded', 'ready'))

export const RawDataDialog = (props: DialogProps) => {
  const mapDef = useMapDef((s) => s) ?? null
  const dispatch = useDispatch()
  const rawData = React.useMemo(() => mapToYAML(mapDef), [mapDef])
  return (
    mapDef && (
      <Dialog {...props}>
        <DialogTitle>MapDef Raw Data</DialogTitle>
        <DialogContent>
          <EditorTextField
            multiline
            fullWidth
            variant="outlined"
            value={rawData}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose as any}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  )
}

export const MenuPanel: React.FC<MenuPanelProps> = (props) => {
  const classes = useStyles(props)
  const { className } = props

  const [open, setOpen] = React.useState<string | null>(null)
  const menuRef = React.useRef<HTMLButtonElement>(null)
  const store = useStore()

  const dispatch = useDispatch()

  const handleAction = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    setOpen(null)
    const { action, dialog } = e.currentTarget.dataset
    if (dialog) {
      return setOpen(dialog)
    }
    switch (action) {
      case 'newmap':
        dispatch(editor.actions.initialize({}))
        return
      case 'export':
        const mapDef = store.getState().editor.mapDef
        if (!mapDef) return
        const rawData = mapToYAML(mapDef)
        const dataUrl = `data:text/yaml;charset=UTF-8,${rawData}`
        const a = e.currentTarget as HTMLAnchorElement
        a.href = dataUrl
        return
    }
  }, [])

  return (
    <PanelBase className={classNames(className, classes.root)}>
      <Toolbar>
        <IconButton ref={menuRef} onClick={() => setOpen('menu')}>
          <SettingsIcon />
        </IconButton>
      </Toolbar>

      <Menu
        anchorEl={menuRef.current}
        open={open === 'menu'}
        onClose={() => setOpen(null)}>
        <MenuItem data-action="newmap" onClick={handleAction}>
          New map
        </MenuItem>
        <MenuItem data-dialog="mapproperties" onClick={handleAction}>
          Map properties
        </MenuItem>
        <MenuItem data-dialog="rawdata" onClick={handleAction}>
          Raw data
        </MenuItem>
        <MenuItem
          component="a"
          download="mapdef.yaml"
          data-action="export"
          onClick={handleAction}>
          Export as YAML
        </MenuItem>
      </Menu>

      <MapPropertyDialog
        open={open === 'mapproperties'}
        onClose={() => setOpen(null)}
      />
      <RawDataDialog open={open === 'rawdata'} onClose={() => setOpen(null)} />
    </PanelBase>
  )
}

MenuPanel.defaultProps = {}

export default MenuPanel
