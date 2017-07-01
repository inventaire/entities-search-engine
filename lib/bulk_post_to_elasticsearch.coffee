{ host:elasticHost } = require('config').elastic

breq = require 'bluereq'

module.exports = (index, type, entities)->
  batch = []
  entities.forEach appendEntity(index, type, batch)
  # It is required to end by a newline break
  body = batch.join('\n') + '\n'
  breq.post "#{elasticHost}/_bulk", body

# see: https://www.elastic.co/guide/en/elasticsearch/guide/current/bulk.html
appendEntity = (index, type, batch)-> (entity)->
  batch.push metaDataLine(index, type, entity.id)
  batch.push JSON.stringify(entity)

metaDataLine = (index, type, id)->
  "{\"index\":{\"_index\":\"#{index}\",\"_type\":\"#{type}\",\"_id\":\"#{id}\"}}"
