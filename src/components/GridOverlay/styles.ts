import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'
import { GridOverlayProps } from './GridOverlay'

export default makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'relative',
    },
    canvas: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
    highlight: {
      position: 'absolute',
      backgroundColor: 'rgba(255,255,127,0.5)',
      pointerEvents: 'none',
    },
    clickThrough: {
      pointerEvents: 'none',
    },
    highlightPosition: (props: GridOverlayProps) => {
      if (typeof props.highlight === 'object') {
        return {
          left: props.highlight.x * props.gridSize.width,
          top: props.highlight.y * props.gridSize.height,
          width: props.highlight.width * props.gridSize.height,
          height: props.highlight.height * props.gridSize.height,
        }
      }
      return {}
    },
  }),
  { name: 'GridOverlay', index: 1 },
)
