# Category Utility

This library allows to clusterize a dataset of purely categorical data by using as a measure of fitness the Category Utility.

You can read more about this value [on wikipedia](https://en.wikipedia.org/wiki/Category_utility). In a nutshell, it tries to maximize the similarity between items in the same cluster, and minimize the one between different clusters.

## API

The function `clusterize` accepts up to 4 parameters and returns an array of arrays of `Point`:

### `data: Point[]`

The array of objects with categorical values to be clusterized. It won't be modified.

### `clusters: number`

The desired number of clusters. They all will start with one item each.

### `weights: Weights - optional`

You can set the weight for each object key, so that while clustering you'll be able to force the function to rely more on some values than others.

### `filteredValues: string[] - optional`

Just like setting the weights for those values to 0, it will not use those object keys while clusterizing.

## Example

```javascript
import { clusterize } from 'category-utility'

const data = [
  { id: '1', size: 'small', color: 'red' },
  { id: '2', size: 'medium', color: 'blue' },
  { id: '3', size: 'large', color: 'red' },
  { id: '4', size: 'medium', color: 'red' },
  { id: '5', size: 'medium', color: 'red' },
  { id: '6', size: 'medium', color: 'blue' },
  { id: '7', size: 'small', color: 'blue' },
]

const weights = { size: 0.5, color: 2 }
const filteredValues = ['id']
const clusters = clusterize(data, 2, weights, filteredValues)

// [ [ { id: '1', size: 'small', color: 'red' },
//     { id: '3', size: 'large', color: 'red' },
//     { id: '4', size: 'medium', color: 'red' },
//     { id: '5', size: 'medium', color: 'red' } ],
//   [ { id: '2', size: 'medium', color: 'blue' },
//     { id: '6', size: 'medium', color: 'blue' },
//     { id: '7', size: 'small', color: 'blue' } ] ]

```

