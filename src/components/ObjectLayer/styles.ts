import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'
import MapType from 'maptype'

export default makeStyles(
  (theme: Theme) => ({
    root: {
      // style code
    },
    tileSize: (mapDef: MapType) => ({
      width: mapDef.gridSize.width,
      height: mapDef.gridSize.height,
    }),
    tile: {
      backgroundColor: 'rgba(255,0,0,0.3)',
      position: 'absolute',
      borderStyle: 'solid',
      borderColor: 'rgba(255,0,0,0.3)',
      borderWidth: 1,
    },
    walkable: {
      backgroundColor: 'unset',
      borderColor: 'rgba(0,255,0,0.1)',
    },
  }),
  { name: 'ObjectLayer', index: 1 },
)
