import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'

export default makeStyles(
  (theme: Theme) => ({
    root: {
      // style code
    },
    colorChipFocus: {
      border: 'solid',
    },
    imgColorPick: {
      cursor: 'crosshair',
    },
  }),
  { name: 'TilesetPropertyDialog', index: 1 },
)
