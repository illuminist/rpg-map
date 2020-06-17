import _ from 'lodash'
import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'
import { TilemapLayer, TilesetDef, Size2D } from 'maptype'

export default makeStyles(
  (theme: Theme) => ({
    root: {
      // style code
    },
    tile: {
      position: 'absolute',
    },
    tileDef: ({
      tileset,
      gridCount,
      gridSize,
    }: TilemapLayer & { gridCount: Size2D; gridSize: Size2D }) => {
      const tilesetDef = tileset as TilesetDef
      const al = _.transform(
        _.times(tilesetDef.gridCount?.height ?? 0, (y) =>
          _.times(tilesetDef.gridCount?.width ?? 0, (x) => {
            return [x, y]
          }),
        ).flatMap(_.identity),
        (acc: any, [x, y]: any, i) => {
          acc[`&.t${i}`] = {
            backgroundPositionX: -x * gridSize.width,
            backgroundPositionY: -y * gridSize.height,
          }
        },
        {},
      )
      return {
        width: gridSize.width,
        height: gridSize.height,
        // backgroundImage: `url(${makeUrl((tileset as TilesetDef).image.src)})`,
        ...al,
      }
    },
    img: {
      display: 'none',
    },
  }),
  { name: 'TilemapLayer', index: 1 },
)
