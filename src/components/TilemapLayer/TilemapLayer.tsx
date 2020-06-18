import _ from 'lodash'
import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import { TilemapLayer as TilemapLayerType, Map2D } from 'maptype'
import { useSelector, useDispatch } from 'react-redux'
import resource from 'store/resource'
import { useMapDef } from 'store/game'
import { getTransparentImageHash } from 'helpers/imageUtils'
import makeUrl from 'helpers/makeUrl'

export interface TilemapLayerProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  layerId: string
  layerDef: TilemapLayerType
}

export const TilemapLayer: React.FC<TilemapLayerProps> = (props) => {
  const { className, layerId } = props
  const dispatch = useDispatch()
  const gridCount = useMapDef((state) => state.gridCount)
  const gridSize = useMapDef((state) => state.gridSize)
  const layerDef = useMapDef(
    (state) => state.layerDefs[layerId],
  ) as TilemapLayerType
  const tilesetDef = useMapDef((state) =>
    typeof layerDef.tileset === 'string'
      ? state.tilesetDefs[layerDef.tileset]
      : undefined,
  )
  const tilesetReady = true

  const classes = useStyles({ ...layerDef, gridCount, gridSize })

  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const imgRef = React.useRef<HTMLImageElement>()

  const processedImage = useSelector((state) =>
    tilesetDef?.image.src
      ? state.resource.image?.[getTransparentImageHash(tilesetDef.image)]
      : undefined,
  )

  const finalSrc = makeUrl(processedImage || tilesetDef?.image.src)

  React.useEffect(() => {
    if (!processedImage && tilesetDef?.image?.transparentColor) {
      dispatch(resource.actions.processImage(tilesetDef.image))
    }
  }, [processedImage, tilesetDef?.image])

  const [loadedSrc, handleLoaded] = React.useReducer((s: string, e: string) => {
    return e
  }, '')
  const lastRenderRef = React.useRef<{ src: string; tiles: Map2D<number> }>()
  React.useLayoutEffect(() => {
    const lastRender = lastRenderRef.current
    const ctx = canvasRef.current?.getContext('2d')
    const img = imgRef.current
    if (!ctx || !img || !tilesetDef) return
    if (!lastRender || lastRender.src !== loadedSrc) {
      _.forEach(layerDef.tiles, (row, y: any) => {
        _.forEach(row, (tiledata, x: any) => {
          ctx.imageSmoothingEnabled = false
          ctx.clearRect(
            gridSize.width * x,
            gridSize.height * y,
            gridSize.width,
            gridSize.height,
          )
          if (tiledata == null) return
          ctx.drawImage(
            img,
            (tiledata % tilesetDef.gridCount.width) * tilesetDef.gridSize.width,
            Math.floor(tiledata / tilesetDef.gridCount.width) *
              tilesetDef.gridSize.height,
            tilesetDef.gridSize.width,
            tilesetDef.gridSize.height,
            gridSize.width * x,
            gridSize.height * y,
            gridSize.width,
            gridSize.height,
          )
        })
      })
    } else {
      _.forEach(layerDef.tiles, (row, y: any) => {
        if (row !== lastRender?.tiles[y]) {
          _.forEach(row, (tiledata, x: any) => {
            if (tiledata !== lastRender.tiles[y]?.[x]) {
              ctx.imageSmoothingEnabled = false
              ctx.clearRect(
                gridSize.width * x,
                gridSize.height * y,
                gridSize.width,
                gridSize.height,
              )
              if (tiledata == null) return
              ctx.drawImage(
                img,
                (tiledata % tilesetDef.gridCount.width) *
                  tilesetDef.gridSize.width,
                Math.floor(tiledata / tilesetDef.gridCount.width) *
                  tilesetDef.gridSize.height,
                tilesetDef.gridSize.width,
                tilesetDef.gridSize.height,
                gridSize.width * x,
                gridSize.height * y,
                gridSize.width,
                gridSize.height,
              )
            }
          })
        }
      })
    }
    lastRenderRef.current = {
      src: loadedSrc,
      tiles: layerDef.tiles,
    }
  }, [loadedSrc, layerDef.tiles, tilesetDef])

  React.useEffect(() => {
    if (!imgRef.current) {
      imgRef.current = document.createElement('img')
    }
    const img = imgRef.current
    if (img) {
      img.src = finalSrc
      img.onload = (e) => handleLoaded(finalSrc)
    }
  }, [finalSrc])

  return tilesetReady ? (
    <div className={classNames(className, classes.root)}>
      <canvas
        ref={canvasRef}
        width={gridCount.width * gridSize.width}
        height={gridCount.height * gridSize.height}
      />
    </div>
  ) : null
}

TilemapLayer.defaultProps = {}

export default TilemapLayer
