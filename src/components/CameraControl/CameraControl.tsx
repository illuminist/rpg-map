import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import { useSelector, useDispatch } from 'react-redux'
import {
  cameraMoveStart,
  cameraMoveSourceRelative,
  cameraMoveEnd,
  cameraZoomStart,
  cameraZoomRelative,
} from 'store/camera'
import useGlobalEvent from 'hooks/useGlobalEvent'
export interface CameraControlProps {
  children: React.ReactNode
}

export const CameraControl = ({ children }: CameraControlProps) => {
  const classes = useStyles({})
  const cameraState = useSelector((state: any) => state.camera)
  const cameraDispatch = useDispatch()

  const ref = React.useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 1) {
      cameraDispatch(
        cameraMoveStart({ sourcePosition: { x: e.pageX, y: e.pageY } }),
      )
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cameraState.isMoving) {
      cameraDispatch(cameraMoveSourceRelative({ x: e.pageX, y: e.pageY }))
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    console.log(e.touches)
    if (cameraState.isMoving) {
      cameraDispatch(
        cameraMoveSourceRelative({
          x: e.touches[0].pageX,
          y: e.touches[0].pageY,
        }),
      )
    }
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    console.log(e.touches)
    if (e.touches.length === 1) {
      cameraDispatch(
        cameraMoveStart({
          sourcePosition: { x: e.touches[0].pageX, y: e.touches[0].pageY },
        }),
      )
    } else if (e.touches.length === 2) {
      cameraDispatch(cameraMoveEnd())
      cameraDispatch(cameraZoomStart())
    }
  }

  useGlobalEvent(
    'mouseup',
    (e) => e.button === 1 && cameraDispatch(cameraMoveEnd()),
    [cameraDispatch],
  )
  React.useEffect(() => {
    const el = ref.current
    if (el) {
      const handleWheel = (e: WheelEvent) => {
        cameraDispatch(
          cameraZoomRelative({
            zoom: -e.deltaY / 200,
            center: { x: e.pageX, y: e.pageY },
            screen: {
              width: el.clientWidth,
              height: el.clientHeight,
            },
          }),
        )
      }
      el.addEventListener('wheel', handleWheel)
      return () => {
        el.removeEventListener('wheel', handleWheel)
      }
    }
  }, [cameraDispatch])

  return (
    <div
      ref={ref}
      className={classNames(classes.root)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}>
      <div
        className={classes.layerContainer}
        style={{
          transform: `translate(50%,50%) translate(${-cameraState.position
            .x}px,${-cameraState.position.y}px) scale(${cameraState.zoom})`,
        }}>
        {children}
      </div>
      <div className={classes.controlInstruction}>
        Middle mouse click and drag to move camera, middle wheel to zoom
      </div>
    </div>
  )
}
CameraControl.defaultProps = {}

export default CameraControl
