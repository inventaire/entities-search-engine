{ host:elasticHost } = require('config').elastic
breq = require 'bluereq'
bulk = require './bulk'
buildLine = bulk.buildLine.bind null, 'index'
_ = require './utils'

module.exports = (index, type, entities)->
  if entities.length is 0 then return Promise.resolve()

  batch = []
  entities.forEach appendEntity(index, type, batch)

  breq.post "#{elasticHost}/_bulk", bulk.joinLines(batch)
  .get 'body'
  .then _.Log('bulk post res')
  .catch _.Error('bulk post err')

# see: https://www.elastic.co/guide/en/elasticsearch/guide/current/bulk.html
appendEntity = (index, type, batch)-> (entity)->
  batch.push buildLine(index, type, entity.id)
  batch.push JSON.stringify(entity)
