import * as React from 'react'

export type MainRef = {
  deps: ReadonlyArray<any>
  runningCount: number
}

export type SelfRef = {
  isCurrent: boolean
  deps: ReadonlyArray<any>
}

export const useAsyncEffect = (
  fn: (ref: SelfRef, mainRef: MainRef) => Promise<void>,
  deps: ReadonlyArray<any>,
) => {
  const mainRef = React.useRef<MainRef>({
    deps: deps,
    runningCount: 0,
  })
  mainRef.current.deps = deps
  React.useEffect(() => {
    const selfRef: SelfRef = {
      isCurrent: true,
      deps,
    }
    mainRef.current.runningCount++
    fn(selfRef, mainRef.current).finally(() => {
      console.log('async fin')
      mainRef.current.runningCount--
    })
    return () => {
      selfRef.isCurrent = false
    }
  }, deps)
}

export default useAsyncEffect
