import _ from 'lodash'
import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import MapType, { ObjectLayer as ObjectLayerType } from 'maptype'

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

  return (
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
                [classes.walkable]: layerDef.walkable?.[y]?.[x],
              })}
            />
          )
        })
      })}
    </div>
  )
}

ObjectLayer.defaultProps = {}

export default ObjectLayer
