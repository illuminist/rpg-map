import _ from 'lodash'
import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import MapType, { ObjectLayer as ObjectLayerType, Map2D } from 'maptype'
import makeUrl from 'helpers/makeUrl'
import useAsyncEffect from 'hooks/useAsyncEffect'

export interface ObjectLayerProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  layerId: string
  layerDef: ObjectLayerType
  mapDef: MapType
}

export const ObjectLayer: React.FC<ObjectLayerProps> = (props) => {
  const { className, mapDef, layerDef } = props
  const classes = useStyles(mapDef)

  const [walkable, setWalkable] = React.useState<Map2D<number> | null>(
    'src' in layerDef.walkable ? null : layerDef.walkable,
  )

  useAsyncEffect(
    async (self) => {
      if (!walkable && 'src' in layerDef.walkable) {
        const img = document.createElement('img')
        img.src = makeUrl(layerDef.walkable.src)
        img.onload = () => {
          if (!self.isCurrent) return
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (!ctx) throw new Error('not-support-canvas')
          ctx.drawImage(img, 0, 0, img.width, img.height)

          const wk = _.times(mapDef.gridCount.height, (y) =>
            _.times(mapDef.gridCount.width, (x) => {
              const px = ctx.getImageData(
                x * mapDef.gridSize.width + mapDef.gridSize.width / 2,
                y * mapDef.gridSize.height + mapDef.gridSize.height / 2,
                1,
                1,
              ).data
              return px[0] ? 0 : 1
            }),
          )

          setWalkable(wk)
        }
      }
    },
    [mapDef, walkable, layerDef.walkable],
  )

  return (
    walkable && (
      <div className={classNames(className, classes.root)}>
        {_.times(mapDef.gridCount.height, (y) => {
          return _.times(mapDef.gridCount.width, (x) => {
            return (
              <div
                key={y + ':' + x}
                style={{
                  top: y * mapDef.gridSize.height,
                  left: x * mapDef.gridSize.width,
                }}
                className={classNames(classes.tile, classes.tileSize, {
                  [classes.walkable]: walkable[y]?.[x],
                })}
              />
            )
          })
        })}
      </div>
    )
  )
}

ObjectLayer.defaultProps = {}

export default ObjectLayer
