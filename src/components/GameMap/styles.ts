import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'

export default makeStyles(
  (theme: Theme) => ({
    root: {
      // style code
    },
    layer: {
      position: 'absolute',
      top: 0,
      left: 0,
      userSelect: 'none',
    },
  }),
  { name: 'GameMap', index: 1 },
)
