import { Counted } from './types'

export function count(list: string[]): Counted {
  return list.reduce<Counted>((acc, k) => {
    acc[k] = acc[k] || 0
    acc[k]++
    return acc
  }, {})
}

export function sum(list: number[]): number {
  return list.reduce<number>((a, v) => a + v, 0)
}

export function flat<T>(list: T[][]): T[] {
  return list.reduce<T[]>((acc, p) => [...acc, ...p], [])
}

export function stupidDeepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
