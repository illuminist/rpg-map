import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import MapType, { ImageLayer as ImageLayerType } from 'maptype'
import makeUrl from 'helpers/makeUrl'

export interface ImageLayerProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  layerId: string
  layerDef: ImageLayerType
  mapDef: MapType
}


export const ImageLayer: React.FC<ImageLayerProps> = (props) => {
  const classes = useStyles(props)
  const { className, layerId, layerDef } = props

  return (
    <div className={classNames(className, classes.root)}>
      <img src={makeUrl(layerDef.src)} alt={layerId} />
    </div>
  )
}

ImageLayer.defaultProps = {}

export default ImageLayer
