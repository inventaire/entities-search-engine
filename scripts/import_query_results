#!/usr/bin/env node
const resultsFolder = './queries/results'
const wdk = require('wikidata-sdk')
const _ = require('../lib/utils')

const types = require('./lib/types_parser')(resultsFolder, 'json')
const callOneByOne = require('./lib/call_one_by_one')
const fetchAndPutEntitiesFromUris = require('../lib/fetch_and_put_entities_from_uris')

const importEntities = type => {
  // Beware of the path leading dot: require works from __dirname
  // not from process.cwd()
  const uris = require(`.${resultsFolder}/${type}.json`)
    // filtering-out properties and blank nodes (type: bnode)
    .filter(wdk.isItemId)
    .map(id => `wd:${id}`)

  return fetchAndPutEntitiesFromUris(type, uris)
  .then(() => _.success(type, 'done'))
  .catch(err => {
    _.error([ err, type ], 'failed')
    throw err
  })
}

callOneByOne(types, 'import', importEntities)
.then(() => _.success(types, 'imports done'))
.catch(err => _.error([ err, types ], 'imports err'))
