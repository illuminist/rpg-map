import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import Button from '@material-ui/core/Button'
import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Radio from '@material-ui/core/Radio'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import { useDispatch } from 'react-redux'
import { useEditorState } from 'store/store'
import editor from 'store/editor'

export interface TilesetImporterDialogProps
  extends Omit<DialogProps, 'open' | 'onClose'> {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
}

const importableTilesets = [
  '/assets/tilesets/grasstown-tileset.yaml',
  '/assets/tilesets/grasstown-tileset-transparent.yaml',
]

export const dialogName = 'tilesetImporter'

export const TilesetImporterDialog: React.FC<TilesetImporterDialogProps> = (
  props,
) => {
  const classes = useStyles(props)
  const { className } = props

  const [selected, setSelected] = React.useState('')
  const [name, setName] = React.useState('')

  const dispatch = useDispatch()
  const open = useEditorState((state) => Boolean(state.dialog[dialogName]))
  const handleClose = () => {
    dispatch(editor.actions.closeDialog({ dialog: dialogName }))
  }
  const handleSelect = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    const tileset = e.currentTarget.dataset.tileset
    if (tileset) {
      setSelected(tileset)
    }
  }, [])
  const handleNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value)
    },
    [],
  )
  const handleImport = async () => {
    dispatch(
      editor.actions.importTileset({
        tilesetId: selected,
        localName: name,
        applyToLayer: true,
      }),
    )
    handleClose()
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className={classNames(className, classes.root)}>
      <DialogTitle>Import tileset</DialogTitle>
      <List>
        {importableTilesets.map((id) => (
          <ListItem
            key={id}
            data-tileset={id}
            selected={selected === id}
            button
            onClick={handleSelect}>
            <ListItemIcon>
              <Radio checked={selected === id} />
            </ListItemIcon>
            <ListItemText>{id}</ListItemText>
          </ListItem>
        ))}
      </List>
      <DialogContent>
        <TextField
          fullWidth
          label="As name"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={selected}
          onChange={handleNameChange}
          value={name}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleImport} disabled={!selected}>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  )
}

TilesetImporterDialog.defaultProps = {}

export default TilesetImporterDialog
