import { Point, Cluster, Weights } from './common/types'
import { count, sum, flat, stupidDeepCopy } from './common/utils'

const ID_KEY = 'id'

function getUnconditionalExpectation(values: Point[], weights: Weights): number {
  const valueCount = values.length
  const columns = Object.keys(values[0])
  const usefulColumns = columns.filter(c => c !== ID_KEY)
  const columnExpectations = usefulColumns.map<number>(k => {
    const allColumnValues = values.map(p => p[k])
    const countedColumnValues = count(allColumnValues)
    const sqProbs = Object.values(countedColumnValues).map(v => (v / valueCount) ** 2)
    const summed = sum(sqProbs)
    const weight = weights[k] === undefined ? 1 : weights[k]
    return summed * weight
  })
  return sum(columnExpectations)
}

function getConditionalExpectation(clusters: Cluster[], weights: Weights): number[] {
  return clusters.map(c => getUnconditionalExpectation(c, weights))
}

function computeCU(clusters: Cluster[], weights: Weights): number {
  const allItems = flat(clusters)
  const totalItems = allItems.length
  const clusterProbabilities = clusters.map<number>(c => c.length / totalItems)
  const uncondExp = getUnconditionalExpectation(allItems, weights)
  const condExp = getConditionalExpectation(clusters, weights)

  let total = 0
  for (let i = 0; i < clusters.length; i++) {
    const clusterValue = clusterProbabilities[i] * (condExp[i] - uncondExp)
    total += clusterValue / 2
  }
  return total
}

export function clusterize(
  rawData: Point[],
  clusterNumber: number,
  columnWeights: Weights = {},
): Cluster[] {
  const data = rawData.slice()
  let clusters = data.splice(0, clusterNumber).map(c => [c])
  for (const point of data) {
    let cu, bestClustering
    for (let i = 0; i < clusters.length; i++) {
      const copy = stupidDeepCopy(clusters)
      copy[i].push(point)
      const currentCU = computeCU(copy, columnWeights)
      if (cu !== undefined && cu > currentCU) continue
      cu = currentCU
      bestClustering = copy
    }
    clusters = bestClustering
  }
  return clusters
}
