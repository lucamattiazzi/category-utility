import { Point, Cluster, Weights, FilteredKeys } from './types'
import { countBy, sum, flatten, cloneDeep } from 'lodash'

function getCondExpGen(weights: Weights, filteredKeys: FilteredKeys) {
  const getUncondExp = getUncondExpGen(weights, filteredKeys)
  return function getCondExp(clusters: Cluster[]) {
    return clusters.map(getUncondExp)
  }
}

function getUncondExpGen(weights: Weights, filteredKeys: FilteredKeys) {
  return function getUncondExp(values: Point[]): number {
    const valueCount = values.length
    const columns = Object.keys(values[0])
    const usefulColumns = columns.filter(c => !filteredKeys.includes(c))
    const columnExpectations = usefulColumns.map<number>(k => {
      const allColumnValues = values.map(p => p[k])
      const countedColumnValues = countBy(allColumnValues)
      const sqProbs = Object.values(countedColumnValues).map(v => (v / valueCount) ** 2)
      const summed = sum(sqProbs)
      const weight = weights[k] === undefined ? 1 : weights[k]
      return summed * weight
    })
    return sum(columnExpectations)
  }
}

function computeCUGen(weights: Weights, filteredKeys: FilteredKeys) {
  const getUncondExp = getUncondExpGen(weights, filteredKeys)
  const getCondExp = getCondExpGen(weights, filteredKeys)
  return function computeCU(clusters: Cluster[]) {
    const allItems = flatten(clusters)
    const totalItems = allItems.length
    const clusterProbabilities = clusters.map<number>(c => c.length / totalItems)
    const uncondExp = getUncondExp(allItems)
    const condExp = getCondExp(clusters)

    let total = 0
    for (let i = 0; i < clusters.length; i++) {
      const clusterValue = clusterProbabilities[i] * (condExp[i] - uncondExp)
      total += clusterValue / 2
    }
    return total
  }
}

export function clusterize(
  rawData: Point[],
  clusterNumber: number,
  columnWeights: Weights = {},
  filteredKeys: FilteredKeys = [],
): Cluster[] {
  const data = rawData.slice()
  const computeCU = computeCUGen(columnWeights, filteredKeys)
  let clusters = data.splice(0, clusterNumber).map(c => [c])
  for (const point of data) {
    let cu, bestClustering
    for (let i = 0; i < clusters.length; i++) {
      const copy = cloneDeep(clusters)
      copy[i].push(point)
      const currentCU = computeCU(copy)
      if (cu !== undefined && cu > currentCU) continue
      cu = currentCU
      bestClustering = copy
    }
    clusters = bestClustering
  }
  return clusters
}
