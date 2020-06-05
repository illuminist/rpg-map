import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'

export default makeStyles(
  (theme: Theme) => ({
    root: {
      // position: 'fixed',
      height: '100vh',
      width: '100vw',
    },
    zoomController: {
      position: 'absolute',
      height: '300vh',
    },
    layerContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '100vw',
    },
    layer: {
      position: 'absolute',
      top: 0,
      left: 0,
      userSelect: 'none',
    },
    controllInstruction: {
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0,0,0,0.3)',
      color: 'white',
      borderTopRightRadius: theme.shape.borderRadius,
      borderTopLeftRadius: theme.shape.borderRadius,
      padding: 16,
    },
  }),
  { name: 'GameMap', index: 1 },
)
