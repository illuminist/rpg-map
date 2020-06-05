import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import MapType, { ImageLayer as ImageLayerType } from 'maptype'

export interface ImageLayerProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  layerId: string
  layerDef: ImageLayerType
  mapDef: MapType
}

export const ImageLayer: React.FC<ImageLayerProps> = (props) => {
  const classes = useStyles(props)
  const { className, layerDef } = props

  return (
    <div className={classNames(className, classes.root)}>
      <img src={layerDef.src} />
    </div>
  )
}

ImageLayer.defaultProps = {}

export default ImageLayer
