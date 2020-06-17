import { MapCache } from './cacheCreator'
import makeUrl from 'helpers/makeUrl'

export const imageCache = MapCache(
  async (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = document.createElement('img')
      img.src = makeUrl(url)
      img.onload = () => resolve(img)
      img.onerror = reject
    }),
)
