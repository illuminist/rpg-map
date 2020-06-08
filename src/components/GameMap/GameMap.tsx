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
import { initMap } from 'store/game'

export interface GameMapProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  mapDef: MapType
}

export const Layer = React.memo(({ layerId }: { layerId: string }) => {
  const classes = useStyles({})
  const layerDef = useSelector((state) => state.map.layerDefs[layerId])
  const layerComponentRender = (layerId: string) => {
    switch (layerDef.type) {
      case 'image':
        return (
          <ImageLayer
            className={classes.layer}
            key={layerId}
            layerId={layerId}
            layerDef={layerDef}
          />
        )
      case 'object':
        return (
          <ObjectLayer
            className={classes.layer}
            key={layerId}
            layerId={layerId}
            layerDef={layerDef}
          />
        )
      default:
        return null
    }
  }
  return layerComponentRender(layerId)
})

export const MapLayerContainer = React.memo(() => {
  const layerOrder = useSelector((state) => state.map.layerOrder)

  return (
    <>
      {layerOrder.map((layerId) => (
        <Layer key={layerId} layerId={layerId} />
      ))}
    </>
  )
})

export const GameMap: React.FC<GameMapProps> = (props) => {
  const classes = useStyles(props)
  const { className, mapDef } = props

  const ready = useSelector((state) => Boolean(state.map))
  const loaded = useSelector((state) => Boolean(state.map?.loaded))
  const dispatch = useDispatch()
  React.useEffect(() => {
    if (!ready) {
      dispatch(initMap(mapDef))
    }
  }, [dispatch, ready, mapDef])

  return loaded && ready ? (
    <div className={classes.root}>
      <CameraControl>
        <MapLayerContainer />
      </CameraControl>
    </div>
  ) : null
}

export const GameRoot = (props: GameMapProps) => {
  return (
    <Provider store={store}>
      <GameMap {...props} />
    </Provider>
  )
}

export default GameRoot
