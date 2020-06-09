import { Position } from 'maptype'

export const surround4 = (position: Position) => {
  return [
    { x: position.x + 1, y: position.y },
    { x: position.x - 1, y: position.y },
    { x: position.x, y: position.y - 1 },
    { x: position.x, y: position.y + 1 },
  ]
}

export const distance = (p1: Position, p2: Position) => {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  return Math.sqrt(dx * dx + dy * dy)
}

export const inbound = (
  pos: Position,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) => x1 <= pos.x && pos.x < x2 && y1 <= pos.y && pos.y < y2

export const posToString = (position: Position) => `${position.x},${position.y}`

export const vectorEq = (p1: Position, p2: Position) =>
  p1.x === p2.x && p1.y === p2.y

export class PositionSet implements Set<Position> {
  private internalSet: Set<string>
  public constructor() {
    this.internalSet = new Set()
  }
  public clear(): void {
    return this.internalSet.clear()
  }
  forEach(
    callbackfn: (value: Position, value2: Position, set: Set<Position>) => void,
    thisArg?: any,
  ): void {
    throw new Error('Method not implemented.')
  }

  public get size(): number {
    return this.internalSet.size
  }

  [Symbol.iterator](): IterableIterator<Position> {
    throw new Error('Method not implemented.')
  }
  entries(): IterableIterator<[Position, Position]> {
    throw new Error('Method not implemented.')
  }
  keys(): IterableIterator<Position> {
    throw new Error('Method not implemented.')
  }
  values(): IterableIterator<Position> {
    throw new Error('Method not implemented.')
  }
  [Symbol.toStringTag]: string
  public add(item: Position) {
    this.internalSet.add(posToString(item))
    return this
  }
  public has(item: Position) {
    return this.internalSet.has(posToString(item))
  }
  public delete(item: Position) {
    return this.internalSet.delete(posToString(item))
  }
}
