import _ from 'lodash'

export const times2D = <T extends any>(
  x: number,
  y: number,
  fn: (x: number, y: number) => T,
) => _.times(y, (j) => _.times(x, (i) => fn(i, j))).flatMap<T>(_.identity)
