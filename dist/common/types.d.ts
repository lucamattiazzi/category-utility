export interface Point {
    id: string;
    [key: string]: string;
}
export interface Cluster extends Array<Point> {
}
export interface Counted {
    [key: string]: number;
}
export interface Weights {
    [key: string]: number;
}
