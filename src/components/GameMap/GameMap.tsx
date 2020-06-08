// import _ from 'lodash'
import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import MapType, { AllLayer } from 'maptype'
import ImageLayer from 'components/ImageLayer'
import ObjectLayer from 'components/ObjectLayer'
import { Provider, useSelector, useDispatch } from 'react-redux'
import CameraControl from 'components/CameraControl'
import store from 'store/store'

export interface GameMapProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  mapDef: MapType
}

export const MapLayerContainer = React.memo(
  ({ mapDef }: { mapDef: MapType }) => {
    const classes = useStyles(mapDef)
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
      <>
        {mapDef.layerOrder.map((layerId) => {
          return layerComponentRender(layerId, mapDef.layerDefs[layerId])
        })}
      </>
    )
  },
)

export const GameMap: React.FC<GameMapProps> = (props) => {
  const classes = useStyles(props)
  const { className, mapDef } = props

  return (
    <Provider store={store}>
      <div className={classes.root}>
        <CameraControl>
          <MapLayerContainer mapDef={mapDef} />
        </CameraControl>
      </div>
    </Provider>
  )
}

GameMap.defaultProps = {}

export default GameMap
