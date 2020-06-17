import _ from 'lodash'
import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import { Size2D, Position, Rect } from 'maptype'

export type GridEvent = {
  grid: Position
}

export type GridPointerEventHandler = (
  p: GridEvent,
  e: React.MouseEvent<HTMLCanvasElement>,
) => void

export type GridOverlayProps = {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  gridSize: Size2D
  gridCount: Size2D
  strokeStyle?: CanvasFillStrokeStyles['strokeStyle']
  highlight?: string | Rect
  clickThrough?: boolean
  onGridClick?: GridPointerEventHandler
  onGridPointerDown?: GridPointerEventHandler
  onGridPointerUp?: GridPointerEventHandler
  onGridPointerMove?: GridPointerEventHandler
} & React.HTMLAttributes<HTMLCanvasElement>

export const GridOverlay: React.FC<GridOverlayProps> = (props) => {
  const classes = useStyles(props)
  const {
    className,
    children,
    gridSize,
    gridCount,
    strokeStyle = 'rgb(255,255,0)',
    highlight = '',
    clickThrough = false,
    onGridClick,
    onGridPointerDown,
    onGridPointerUp,
    onGridPointerMove,
    ...restProp
  } = props

  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const width = gridCount.width * gridSize.width
  const height = gridCount.height * gridSize.height

  React.useLayoutEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, width, height)
      ctx.beginPath()
      _.times(gridCount.height + 1, (y) => {
        ctx.moveTo(0, y * gridSize.height)
        ctx.lineTo(width, y * gridSize.height)
      })

      _.times(gridCount.width + 1, (width) => {
        ctx.moveTo(width * gridSize.width, 0)
        ctx.lineTo(width * gridSize.width, height)
      })
      ctx.strokeStyle = strokeStyle
      ctx.stroke()
    }
  }, [
    width,
    height,
    gridSize.width,
    gridSize.height,
    gridCount.width,
    gridCount.height,
    strokeStyle,
  ])

  const determineGridPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvasRect = e.currentTarget.getBoundingClientRect()
    const xpos = e.clientX - canvasRect.x
    const ypos = e.clientY - canvasRect.y
    return {
      x: Math.floor(
        xpos /
          (gridSize.width *
            (canvasRect.width / (gridSize.width * gridCount.width))),
      ),
      y: Math.floor(
        ypos /
          (gridSize.height *
            (canvasRect.height / (gridSize.height * gridCount.height))),
      ),
    }
  }

  const downPosRef = React.useRef<Position | null>(null)
  const lastPosRef = React.useRef<Position | null>(null)
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = determineGridPos(e)
    if (downPosRef.current?.x === pos.x && downPosRef.current?.y === pos.y) {
      onGridClick?.({ grid: pos }, e)
    }
    restProp.onClick?.(e)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = determineGridPos(e)
    const lastPos = lastPosRef.current

    if (!lastPos || lastPos.x !== pos.x || lastPos.y !== pos.y) {
      onGridPointerMove?.({ grid: pos }, e)
    }
    lastPosRef.current = pos
    restProp.onMouseMove?.(e)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = determineGridPos(e)
    downPosRef.current = pos
    onGridPointerDown?.({ grid: pos }, e)
    restProp.onMouseDown?.(e)
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = determineGridPos(e)
    onGridPointerUp?.({ grid: pos }, e)
    restProp.onMouseUp?.(e)
  }

  return (
    <div className={classNames(className, classes.root)}>
      {children}
      <canvas
        {...restProp}
        ref={canvasRef}
        width={width}
        height={height}
        className={classNames(classes.canvas, {
          [classes.clickThrough]: clickThrough,
        })}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
      {highlight && (
        <div
          className={classNames(classes.highlight, classes.highlightPosition)}
        />
      )}
    </div>
  )
}

GridOverlay.defaultProps = {}

export default GridOverlay
