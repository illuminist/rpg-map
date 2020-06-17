import YAML from 'yaml'
import makeUrl from './makeUrl'

export const loadDataResource = async <T = any>(url: string): Promise<T> => {
  const fullUrl = makeUrl(url)
  const response = await fetch(fullUrl)
  const contentType = response.headers.get('content-type')
  if (!contentType)
    throw new Error('unable to determine content-type:' + fullUrl)
  const [mime] = contentType.split(/;\s*/i)

  switch (mime) {
    case 'text/yaml':
      const body = await response.text()
      const data = YAML.parse(body)
      return data as T
    case 'text/json':
      return response.json() as Promise<T>
    default:
      throw new Error('unsupport mime: ' + mime + ' : ' + fullUrl)
  }
}

export const loadImageResource = async (
  url: string,
): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.src = makeUrl(url)
    img.onload = () => resolve(img)
    img.onerror = reject
  })
