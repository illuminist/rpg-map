import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'

export default makeStyles(
  (theme: Theme) => ({
    root: {
      marginBottom: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
    },
  }),
  { name: 'PanelBase', index: 1 },
)
