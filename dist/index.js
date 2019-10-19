"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./common/utils");
const ID_KEY = 'id';
function getUnconditionalExpectation(values, weights) {
    const valueCount = values.length;
    const columns = Object.keys(values[0]);
    const usefulColumns = columns.filter(c => c !== ID_KEY);
    const columnExpectations = usefulColumns.map(k => {
        const allColumnValues = values.map(p => p[k]);
        const countedColumnValues = utils_1.count(allColumnValues);
        const sqProbs = Object.values(countedColumnValues).map(v => (v / valueCount) ** 2);
        const summed = utils_1.sum(sqProbs);
        const weight = weights[k] === undefined ? 1 : weights[k];
        return summed * weight;
    });
    return utils_1.sum(columnExpectations);
}
function getConditionalExpectation(clusters, weights) {
    return clusters.map(c => getUnconditionalExpectation(c, weights));
}
function computeCU(clusters, weights) {
    const allItems = utils_1.flat(clusters);
    const totalItems = allItems.length;
    const clusterProbabilities = clusters.map(c => c.length / totalItems);
    const uncondExp = getUnconditionalExpectation(allItems, weights);
    const condExp = getConditionalExpectation(clusters, weights);
    let total = 0;
    for (let i = 0; i < clusters.length; i++) {
        const clusterValue = clusterProbabilities[i] * (condExp[i] - uncondExp);
        total += clusterValue / 2;
    }
    return total;
}
function clusterize(rawData, clusterNumber, columnWeights = {}) {
    const data = rawData.slice();
    let clusters = data.splice(0, clusterNumber).map(c => [c]);
    for (const point of data) {
        let cu, bestClustering;
        for (let i = 0; i < clusters.length; i++) {
            const copy = utils_1.stupidDeepCopy(clusters);
            copy[i].push(point);
            const currentCU = computeCU(copy, columnWeights);
            if (cu !== undefined && cu > currentCU)
                continue;
            cu = currentCU;
            bestClustering = copy;
        }
        clusters = bestClustering;
    }
    return clusters;
}
exports.clusterize = clusterize;
