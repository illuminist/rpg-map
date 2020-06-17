import _ from 'lodash'
import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import { ObjectLayer as ObjectLayerType, Map2D } from 'maptype'
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
        'walkable' in layerDef &&
        (layerDef.walkable as Map2D<number>)[y][x] === 0
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
                key={`${x}-${y}`}
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
  const objectDefs = useSelector((state) => state.map.objectDefs)

  return (
    layerDef.walkable && (
      <>
        <WalkableIndicator layerId={layerId} />
        {objectDefs &&
          Object.keys(objectDefs)
            .filter((objId) => objectDefs[objId].layer === layerId)
            .map((objId) => <GameObject key={objId} objectId={objId} />)}
      </>
    )
  )
}

ObjectLayer.defaultProps = {}

export default ObjectLayer
