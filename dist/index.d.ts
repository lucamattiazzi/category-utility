import { Point, Cluster, Weights, FilteredKeys } from './common/types';
export declare function clusterize(rawData: Point[], clusterNumber: number, columnWeights?: Weights, filteredKeys?: FilteredKeys): Cluster[];
