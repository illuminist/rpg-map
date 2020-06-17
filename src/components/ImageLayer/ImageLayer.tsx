import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import MapType, { ImageLayer as ImageLayerType } from 'maptype'
import makeUrl from 'helpers/makeUrl'
import { useMapDef } from 'store/game'

export interface ImageLayerProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  layerId: string
  layerDef: ImageLayerType
}

export const ImageLayer: React.FC<ImageLayerProps> = (props) => {
  const classes = useStyles(props)
  const { className, layerId, layerDef } = props
  const gridSize = useMapDef((state) => state.gridSize)

  return (
    <div className={classNames(className, classes.root)}>
      <img
        style={{
          transform: `translate(${gridSize.width * layerDef.offset.x}px,${
            gridSize.height * layerDef.offset.y
          }px) scale(${layerDef.scale.width}, ${layerDef.scale.height})`,
        }}
        src={makeUrl(layerDef.src)}
        alt={layerId}
      />
    </div>
  )
}

ImageLayer.defaultProps = {}

export default ImageLayer
