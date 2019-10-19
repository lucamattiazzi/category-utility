"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const data = [
    { id: '1', size: 'small', color: 'red' },
    { id: '2', size: 'medium', color: 'blue' },
    { id: '3', size: 'large', color: 'red' },
    { id: '4', size: 'medium', color: 'red' },
    { id: '5', size: 'medium', color: 'red' },
    { id: '6', size: 'medium', color: 'blue' },
    { id: '7', size: 'small', color: 'blue' },
];
const weights = { size: 0.5, color: 2 };
const filteredValues = ['id'];
const clusters = index_1.clusterize(data, 2, weights, filteredValues);
console.log(clusters);
