import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'

export default makeStyles(
  (theme: Theme) => ({
    root: {
      // style code
    },
    center: {
      overflowY: 'auto',
    },
  }),
  { name: 'LayerPanel', index: 1 },
)
