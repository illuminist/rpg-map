import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import { useSelector, useDispatch } from 'react-redux'
import { selectObject } from 'store/game'
import { useSpring, animated } from 'react-spring'
import makeUrl from 'helpers/makeUrl'

export interface GameObjectProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  objectId: string
}

export const GameObject = (props: GameObjectProps) => {
  const classes = useStyles(props)
  const { className, objectId } = props
  const dispatch = useDispatch()
  const gridSize = useSelector((state) => state.map.gridSize)
  const objectDef = useSelector((state) => state.map.objectDefs[objectId])
  const spriteDef = useSelector(
    (state) => state.map.spriteDefs[objectDef.sprite],
  )

  const selectable = useSelector((state) => !state.map.animating)

  const style = useSpring({
    transform: `translate(${gridSize.width * objectDef.position.x}px,${
      gridSize.height * objectDef.position.y
    }px)`,
    config: { duration: 270 },
  })

  const handleSelect = () => {
    dispatch(selectObject(objectId))
  }

  switch (spriteDef.type) {
    case 'image':
      return (
        <animated.img
          alt={`${objectId}:${objectDef.sprite}`}
          className={classNames(className, classes.root, {
            [classes.selectable]: selectable,
          })}
          style={style}
          src={makeUrl(spriteDef.src)}
          onClick={selectable ? handleSelect : undefined}
          draggable={false}
        />
      )
    default:
      return null
  }
}

GameObject.defaultProps = {}

export default GameObject
