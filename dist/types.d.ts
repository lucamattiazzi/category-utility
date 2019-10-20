export interface Point {
    [key: string]: string;
}
export interface Cluster extends Array<Point> {
}
export interface FilteredKeys extends Array<string> {
}
export interface Weights {
    [key: string]: number;
}
