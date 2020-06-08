import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import { useSelector, useDispatch } from 'react-redux'
import { selectObject } from 'store/game'
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

  const selectable = useSelector(() => true)

  const style = {
    transform: `translate(${gridSize.width * objectDef.position.x}px,${
      gridSize.height * objectDef.position.y
    }px)`,
    cursor: selectable ? 'pointer' : 'default',
  }

  const handleSelect = () => {
    dispatch(selectObject(objectId))
  }

  switch (spriteDef.type) {
    case 'image':
      return (
        <img
          alt={`${objectId}:${objectDef.sprite}`}
          className={classNames(className, classes.root)}
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
