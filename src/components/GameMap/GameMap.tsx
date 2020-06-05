import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import MapType, { AllLayer } from 'maptype'
import ImageLayer from 'components/ImageLayer'
import ObjectLayer from 'components/ObjectLayer'

export interface GameMapProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  mapDef: MapType
}

export const GameMap: React.FC<GameMapProps> = (props) => {
  const classes = useStyles(props)
  const { className, mapDef } = props

  const layerComponentRender = (layerId: string, layerDef: AllLayer) => {
    switch (layerDef.type) {
      case 'image':
        return (
          <ImageLayer
            className={classes.layer}
            key={layerId}
            layerId={layerId}
            layerDef={layerDef}
            mapDef={mapDef}
          />
        )
      case 'object':
        return (
          <ObjectLayer
            className={classes.layer}
            key={layerId}
            layerId={layerId}
            layerDef={layerDef}
            mapDef={mapDef}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={classNames(className, classes.root)}>
      {mapDef.layerOrder.map((layerId) => {
        return layerComponentRender(layerId, mapDef.layerDefs[layerId])
      })}
    </div>
  )
}

GameMap.defaultProps = {}

export default GameMap
