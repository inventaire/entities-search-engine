#!/usr/bin/env node

// ex: ./scripts/results_diff ./queries/results/genres.2016-06-06T21-15.json ./queries/results/genres.json

const [ pathA, pathB ] = process.argv.slice(2)
const _ = require('lodash')

const path = require('path')

const a = require(path.resolve(pathA))
const b = require(path.resolve(pathB))

console.log('a', a.length)
console.log('b', b.length)

const aMinB = _.difference(a, b)
const bMinA = _.difference(b, a)

console.log('a without b', aMinB.length)
console.log('b without a', bMinA.length)
