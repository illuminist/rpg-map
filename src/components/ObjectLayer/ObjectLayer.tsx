import _ from 'lodash'
import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import { ObjectLayer as ObjectLayerType, Map2D } from 'maptype'
import makeUrl from 'helpers/makeUrl'
import useAsyncEffect from 'hooks/useAsyncEffect'
import { useSelector, useDispatch } from 'react-redux'
import GameObject from 'components/GameObject'
import { walkObject } from 'store/game'

export interface ObjectLayerProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  layerId: string
  layerDef: ObjectLayerType
}

const WalkableIndicatorTile = React.memo(
  ({
    x,
    y,
    classes,
    layerId,
  }: {
    x: number
    y: number
    classes: any
    layerId: string
  }) => {
    const gridSize = useSelector((state) => state.map.gridSize)
    const displayMove = useSelector(
      (state) => state.map.moveableDisplay?.[x + ',' + y],
    )
    const walkable = useSelector((state) => {
      const layerDef = state.map.layerDefs?.[layerId]
      return (
        'walkable' in layerDef && (layerDef.walkable as Map2D<number>)[y][x]
      )
    })
    const dispatch = useDispatch()

    return (
      <div
        key={y + ':' + x}
        style={{
          top: y * gridSize.height,
          left: x * gridSize.width,
        }}
        className={classNames(classes.tile, classes.tileSize, {
          [classes.walkable]: walkable,
          [classes.displayMove]: walkable && displayMove,
        })}
        onClick={
          walkable && displayMove
            ? () => dispatch(walkObject({ destination: { x, y } }))
            : undefined
        }
      />
    )
  },
)

export const WalkableIndicator = React.memo(
  ({ layerId }: { layerId: string }) => {
    const gridSize = useSelector((state) => state.map.gridSize)
    const gridCount = useSelector((state) => state.map.gridCount)
    const classes = useStyles({ ...gridSize })
    return (
      <div className={classNames(classes.root)}>
        {_.times(gridCount.height, (y) => {
          return _.times(gridCount.width, (x) => {
            return (
              <WalkableIndicatorTile
                x={x}
                y={y}
                classes={classes}
                layerId={layerId}
              />
            )
          })
        })}
      </div>
    )
  },
)

export const ObjectLayer: React.FC<ObjectLayerProps> = (props) => {
  const { className, layerDef, layerId } = props
  const gridSize = useSelector((state) => state.map.gridSize)
  const gridCount = useSelector((state) => state.map.gridCount)
  const objectDefs = useSelector((state) => state.map.objectDefs)
  const classes = useStyles({ ...gridSize })

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

          const wk = _.times(gridCount.height, (y) =>
            _.times(gridCount.width, (x) => {
              const px = ctx.getImageData(
                x * gridSize.width + gridSize.width / 2,
                y * gridSize.height + gridSize.height / 2,
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
    [gridCount, gridSize, walkable, layerDef.walkable],
  )

  return (
    walkable && (
      <>
        <WalkableIndicator layerId={layerId} />
        {Object.keys(objectDefs)
          .filter((objId) => objectDefs[objId].layer === layerId)
          .map((objId) => (
            <GameObject key={objId} objectId={objId} />
          ))}
      </>
    )
  )
}

ObjectLayer.defaultProps = {}

export default ObjectLayer
