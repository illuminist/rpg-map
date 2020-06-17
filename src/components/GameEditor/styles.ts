import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'

export default makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
    },
    drawerPaper: {
      backgroundColor: 'rgba(66, 66, 66, 0.5)',
      maxWidth: '25vw',
      boxShadow: theme.shadows[15],
    },
  }),
  { name: 'GameEditor', index: 1 },
)
