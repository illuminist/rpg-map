import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'
import { Size2D } from 'maptype'

export default makeStyles(
  (theme: Theme) => ({
    root: {
      // style code
    },
    gridContainer: {
      position: 'absolute',
    },
    grid: {
      borderRightStyle: 'dashed',
      borderBottomStyle: 'dashed',
      borderWidth: 2,
      borderColor: 'rgba(255,0,255,0.4)',
      position: 'absolute',
    },
    gridSize: ({ gridSize }: { gridSize: Size2D }) => ({
      ...gridSize,
    }),
    gridTarget: {
      backgroundColor: 'rgba(255,255,0,0.5)',
    },
  }),
  { name: 'MapEditorOverlay', index: 1 },
)
