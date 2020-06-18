// import _ from 'lodash'
import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import MapType, { AllLayer } from 'maptype'
import ImageLayer from 'components/ImageLayer'
import ObjectLayer from 'components/ObjectLayer'
import { Provider, useSelector, useDispatch } from 'react-redux'
import CameraControl from 'components/CameraControl'
import store, { useEditorState } from 'store/store'
import { initMap, useMapDef } from 'store/game'
import TilemapLayer from 'components/TilemapLayer'

export interface GameMapProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  mapDef: MapType
  overlay?: React.ReactNode
}

export const Layer = React.memo(({ layerId }: { layerId: string }) => {
  const classes = useStyles({})
  const layerDef = useMapDef((state) => state.layerDefs[layerId])
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
      case 'tilemap':
        return (
          <TilemapLayer
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
  const layerOrder = useMapDef((state) => state.layerOrder)
  const hiddenLayer = useEditorState((state) => state.hiddenLayer)
  return (
    <>
      {layerOrder.map((layerId) =>
        hiddenLayer[layerId] ? null : <Layer key={layerId} layerId={layerId} />,
      )}
    </>
  )
})

// const TilesetProcessor = React.useMemo(() => {
//   const tilesetDefs = useMapDef(state.pro)
//   return null
// })

export const GameMap: React.FC<GameMapProps> = (props) => {
  const classes = useStyles(props)
  const { className, mapDef, overlay } = props

  const ready = useMapDef((state) => Boolean(state))
  const loaded = useMapDef((state) => Boolean((state as any).loaded))
  const dispatch = useDispatch()
  React.useEffect(() => {
    if (!ready) {
      dispatch(initMap(mapDef))
    }
  }, [dispatch, ready, mapDef])

  return (
    <div className={classes.root}>
      <CameraControl>
        <MapLayerContainer />
        {overlay}
      </CameraControl>
    </div>
  )
}

export const GameRoot = (props: GameMapProps) => {
  return <GameMap {...props} />
}

export default GameRoot
