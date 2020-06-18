import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'

export default makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'fixed',
      height: '100%',
      width: '100%',
    },
    layerContainer: {
      transformOrigin: '0 0',
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      transition: theme.transitions.create('transform', { duration: 100 }),
    },
    controlInstruction: {
      position: 'fixed',
      bottom: 0,
      left: '50%',
    },
    controlInstructionInner: {
      backgroundColor: 'rgba(0,0,0,0.3)',
      color: 'white',
      borderTopRightRadius: theme.shape.borderRadius,
      borderTopLeftRadius: theme.shape.borderRadius,
      padding: 16,
      transform: 'translateX(-50%)',
    },
  }),
  { name: 'CameraControl', index: 1 },
)
