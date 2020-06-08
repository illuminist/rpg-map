import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import { useSelector, useDispatch } from 'react-redux'
import { useSpring, config, animated } from 'react-spring'
import {
  cameraMoveStart,
  cameraMoveSourceRelative,
  cameraMoveEnd,
  cameraZoomStart,
  cameraZoomRelative,
} from 'store/camera'
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

  React.useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 1) {
        cameraDispatch(cameraMoveEnd())
      }
    }
    const handleWheel = (e: WheelEvent) => {
      ref.current &&
        cameraDispatch(
          cameraZoomRelative({
            zoom: -e.deltaY / 200,
            center: { x: e.pageX, y: e.pageY },
            screen: {
              width: ref.current.clientWidth,
              height: ref.current.clientHeight,
            },
          }),
        )
    }
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('wheel', handleWheel)
    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  const { transform } = useSpring({
    // camera: [cameraState.zoom, cameraState.position.x, cameraState.position.y],
    transform: `translate(50%,50%) translate(${-cameraState.position
      .x}px,${-cameraState.position.y}px) scale(${cameraState.zoom})`,
    config: config.stiff,
  })

  return (
    <div
      ref={ref}
      className={classNames(classes.root)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}>
      <animated.div
        className={classes.layerContainer}
        style={{
          transform,
        }}>
        {children}
      </animated.div>
      <div className={classes.controlInstruction}>
        Middle mouse click and drag to move camera, middle wheel to zoom
      </div>
    </div>
  )
}
CameraControl.defaultProps = {}

export default CameraControl
