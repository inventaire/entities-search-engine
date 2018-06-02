Promise = require 'bluebird'
bulk = require './bulk'
buildLine = bulk.buildLine.bind null, 'delete'
_ = require './utils'
getIdsByTypes = require '../lib/get_ids_by_types'

module.exports = (index, type='_all', uris)->
  if uris.length is 0 then return Promise.resolve()

  _.log [ index, type, uris ], 'unindexed'

  getBatch index, type, uris.map(unprefixify)
  .then (batch)->
    if batch.length is 0 then return
    bulk.postBatch batch
    .then bulk.logRes("bulk unindex res (#{index}/#{type})")
  .catch _.ErrorRethrow('unindex err')

# If it has a URI prefix (like 'wd' or 'inv'), remove it
# as entities are indexed with there sole id, the domain being represented
# by the index
unprefixify = (uri)-> uri.replace /^(inv:|wd:)/, ''

getBatch = (index, type, ids)->
  if type? and type isnt '_all'
    return Promise.resolve getTypeBatchLines(index, type, ids)

  getIdsByTypes index, ids
  .then (idsByTypes)->
    _.log idsByTypes, 'idsByTypes'
    Object.keys idsByTypes
    .reduce aggregateBatch(index, idsByTypes), []

aggregateBatch = (index, idsByTypes)-> (batch, type)->
  ids = idsByTypes[type]
  batch = batch.concat getTypeBatchLines(index, type, ids)
  return batch

getTypeBatchLines = (index, type, ids)->
  ids.map buildLine.bind(null, index, type)
