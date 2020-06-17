import * as React from 'react'

export const useGlobalEvent = function <K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  dep?: React.DependencyList,
) {
  React.useEffect(() => {
    window.addEventListener(type, listener)
    return () => {
      window.removeEventListener(type, listener)
    }
  }, dep)
}

export default useGlobalEvent
