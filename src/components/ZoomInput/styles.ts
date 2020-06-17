import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'
import { IZoomInputProps } from './ZoomInput'

export default makeStyles<IZoomInputProps>(
  (theme: Theme) => ({
    root: {
      height: props => props.height,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },

    input: {
      width: 48,
      textAlign: 'right',
    },
  }),
  { name: 'ZoomInput', index: 1 },
)
