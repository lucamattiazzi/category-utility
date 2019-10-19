"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function count(list) {
    return list.reduce((acc, k) => {
        acc[k] = acc[k] || 0;
        acc[k]++;
        return acc;
    }, {});
}
exports.count = count;
function sum(list) {
    return list.reduce((a, v) => a + v, 0);
}
exports.sum = sum;
function flat(list) {
    return list.reduce((acc, p) => [...acc, ...p], []);
}
exports.flat = flat;
function stupidDeepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.stupidDeepCopy = stupidDeepCopy;
