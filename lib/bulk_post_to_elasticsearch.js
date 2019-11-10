CONFIG = require 'config'
bulk = require './bulk'
buildLine = bulk.buildLine.bind null, 'index'
_ = require './utils'
{ wikidata:wdIndex, inventaire:invIndex } = CONFIG.elastic.indexes
{ getEntityDomain } = require './helpers'

indexPerDomain =
  wd: wdIndex
  inv: invIndex

module.exports = (type, entities)->
  if entities.length is 0 then return Promise.resolve()

  batch = []
  entities.forEach appendEntity(type, batch)

  bulk.postBatch batch
  .then bulk.logRes('bulk post res')
  .catch _.Error('bulk post err')

# see: https://www.elastic.co/guide/en/elasticsearch/guide/current/bulk.html
appendEntity = (type, batch)-> (entity)->
  domain = getEntityDomain entity
  # Guessing the index that late allows to not assume the index from the source
  # as Wikidata entities might be coming from the Inventaire API
  # Known case: Inventaire entities redirecting to Wikidata entities
  index = indexPerDomain[domain]
  batch.push buildLine(index, type, entity.id)
  batch.push JSON.stringify(entity)
