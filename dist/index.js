"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function getCondExpGen(weights, filteredKeys) {
    const getUncondExp = getUncondExpGen(weights, filteredKeys);
    return function getCondExp(clusters) {
        return clusters.map(getUncondExp);
    };
}
function getUncondExpGen(weights, filteredKeys) {
    return function getUncondExp(values) {
        const valueCount = values.length;
        const columns = Object.keys(values[0]);
        const usefulColumns = columns.filter(c => !filteredKeys.includes(c));
        const columnExpectations = usefulColumns.map(k => {
            const allColumnValues = values.map(p => p[k]);
            const countedColumnValues = lodash_1.countBy(allColumnValues);
            const sqProbs = Object.values(countedColumnValues).map(v => (v / valueCount) ** 2);
            const summed = lodash_1.sum(sqProbs);
            const weight = weights[k] === undefined ? 1 : weights[k];
            return summed * weight;
        });
        return lodash_1.sum(columnExpectations);
    };
}
function computeCUGen(weights, filteredKeys) {
    const getUncondExp = getUncondExpGen(weights, filteredKeys);
    const getCondExp = getCondExpGen(weights, filteredKeys);
    return function computeCU(clusters) {
        const allItems = lodash_1.flatten(clusters);
        const totalItems = allItems.length;
        const clusterProbabilities = clusters.map(c => c.length / totalItems);
        const uncondExp = getUncondExp(allItems);
        const condExp = getCondExp(clusters);
        let total = 0;
        for (let i = 0; i < clusters.length; i++) {
            const clusterValue = clusterProbabilities[i] * (condExp[i] - uncondExp);
            total += clusterValue / 2;
        }
        return total;
    };
}
function clusterize(rawData, clusterNumber, columnWeights = {}, filteredKeys = []) {
    const data = rawData.slice();
    const computeCU = computeCUGen(columnWeights, filteredKeys);
    let clusters = data.splice(0, clusterNumber).map(c => [c]);
    for (const point of data) {
        let cu, bestClustering;
        for (let i = 0; i < clusters.length; i++) {
            const copy = lodash_1.cloneDeep(clusters);
            copy[i].push(point);
            const currentCU = computeCU(copy);
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
