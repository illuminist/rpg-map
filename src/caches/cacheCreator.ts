export const WeakMapCache = function <T extends object, D>(
  initialFunc: (arg: T) => D,
) {
  const cache = new WeakMap<T, D>()
  return {
    get: (dataObject: T): D => {
      if (!cache.has(dataObject)) {
        cache.set(dataObject, initialFunc(dataObject))
      }
      return cache.get(dataObject) as D
    },
  }
}

export const MapCache = function <T, D, S = T>(
  initialFunc: (arg: T) => D,
  serializer: (arg: T) => S = (a) => a as any,
) {
  const cache = new Map<S, D>()
  return {
    get: (dataObject: T): D => {
      const s = serializer(dataObject)
      if (!cache.has(s)) {
        cache.set(s, initialFunc(dataObject))
      }
      return cache.get(s) as D
    },
    delete: (dataObject: T): D | undefined => {
      const s = serializer(dataObject)
      const d = cache.get(s)
      cache.delete(s)
      return d
    },
  }
}
