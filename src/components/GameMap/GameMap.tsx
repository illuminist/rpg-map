import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import MapType, { AllLayer } from 'maptype'
import ImageLayer from 'components/ImageLayer'
import ObjectLayer from 'components/ObjectLayer'
import { createReducer, createAction } from '@reduxjs/toolkit'
import { useSpring, animated } from 'react-spring'

export interface GameMapProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  mapDef: MapType
}

type CameraState = {
  isMoving: boolean
  position: {
    x: number
    y: number
  }
  zoom: number
}
const initialCameraState: CameraState = {
  isMoving: false,
  position: {
    x: 0,
    y: 0,
  },
  zoom: 1,
}

const cameraMoveStart = createAction('cameramovestart')
const cameraZoomRelative = createAction<number>('cameramovezoomrelative')
const cameraMoveRelative = createAction<{ x: number; y: number }>(
  'cameramoverelative',
)
const cameraMoveEnd = createAction('cameramoveend')
const cameraReducer = createReducer(initialCameraState, (builder) =>
  builder
    .addCase(cameraMoveStart, (state, action) => {
      state.isMoving = true
    })
    .addCase(cameraMoveEnd, (state, action) => {
      state.isMoving = false
    })
    .addCase(cameraMoveRelative, (state, action) => {
      state.position.x += action.payload.x
      state.position.y += action.payload.y
    })
    .addCase(cameraZoomRelative, (state, action) => {
      state.zoom = Math.min(8, Math.max(0.1, state.zoom + action.payload))
    }),
)

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

  const [cameraState, cameraDispatch] = React.useReducer(
    cameraReducer,
    initialCameraState,
  )

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 1) {
      cameraDispatch(cameraMoveStart())
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cameraState.isMoving) {
      cameraDispatch(cameraMoveRelative({ x: e.movementX, y: e.movementY }))
    }
  }

  React.useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 1) {
        cameraDispatch(cameraMoveEnd())
      }
    }
    const handleWheel = (e: WheelEvent) => {
      cameraDispatch(cameraZoomRelative(-e.deltaY / 200))
    }
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('wheel', handleWheel)
    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  const pp = useSpring({ zoom: cameraState.zoom })

  return (
    <div
      className={classNames(className, classes.root)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}>
      <animated.div
        className={classes.layerContainer}
        style={{
          transform: pp.zoom.interpolate(
            (zoom) =>
              `translate(${cameraState.position.x}px,${cameraState.position.y}px) scale(${zoom})`,
          ),
        }}>
        <MapLayerContainer mapDef={mapDef} />
      </animated.div>
      <div className={classes.controllInstruction}>
        Middle mouse click and drag to move camera, middle wheel to zoom
      </div>
    </div>
  )
}

GameMap.defaultProps = {}

export default GameMap
