import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'

export default makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'absolute',
      userSelect: 'none',
    },
    selectable: {
      cursor: 'pointer',
    },
  }),
  { name: 'GameObject', index: 1 },
)
