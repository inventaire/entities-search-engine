// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Promise = require('bluebird')
const bulk = require('./bulk')
const buildLine = bulk.buildLine.bind(null, 'delete')
const _ = require('./utils')
const getIdsByTypes = require('../lib/get_ids_by_types')

module.exports = function (index, type = '_all', uris) {
  if (uris.length === 0) { return Promise.resolve() }

  _.log([ index, type, uris ], 'unindexed')

  return getBatch(index, type, uris.map(unprefixify))
  .then(batch => {
    if (batch.length === 0) { return }
    return bulk.postBatch(batch)
    .then(bulk.logRes(`bulk unindex res (${index}/${type})`))
  }).catch(_.ErrorRethrow('unindex err'))
}

// If it has a URI prefix (like 'wd' or 'inv'), remove it
// as entities are indexed with there sole id, the domain being represented
// by the index
var unprefixify = uri => uri.replace(/^(inv:|wd:)/, '')

var getBatch = function (index, type, ids) {
  if ((type != null) && (type !== '_all')) {
    return Promise.resolve(getTypeBatchLines(index, type, ids))
  }

  return getIdsByTypes(index, ids)
  .then(idsByTypes => {
    _.log(idsByTypes, 'idsByTypes')
    return Object.keys(idsByTypes)
    .reduce(aggregateBatch(index, idsByTypes), [])
  })
}

var aggregateBatch = (index, idsByTypes) => function (batch, type) {
  const ids = idsByTypes[type]
  batch = batch.concat(getTypeBatchLines(index, type, ids))
  return batch
}

var getTypeBatchLines = (index, type, ids) => ids.map(buildLine.bind(null, index, type))
