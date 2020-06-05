import * as React from 'react'
import get from 'lodash/get'
import setWith from 'lodash/setWith'

export type RefMap2D<T> = (x: number, y: number) => { current: T }

export function useRefMap2D<T>(): RefMap2D<T> {
  const ref = React.useRef<{ [x: number]: { [y: number]: { current: T } } }>()
  return React.useCallback((x: number, y: number) => {
    if (!get(ref, ['current', x, y])) {
      setWith(ref, ['current', x, y], { current: null }, Object)
    }
    return get(ref, ['current', x, y]) as { current: T }
  }, [])
}

export default useRefMap2D
