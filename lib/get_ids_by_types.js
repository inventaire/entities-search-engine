{ host:elasticHost } = require('config').elastic
breq = require 'bluereq'
_ = require './utils'

module.exports = (index, ids)->
  # See https://www.elastic.co/guide/en/elasticsearch/reference/2.1/docs-multi-get.html
  unless typeof index is 'string'
    throw new Error("invalid index: #{index}")

  unless ids instanceof Array
    throw new Error("invalid ids: #{ids}")

  breq.post "#{elasticHost}/#{index}/_mget?_source=false", { ids }
  .then (res)->
    res.body.docs
    .reduce aggregateIdsByType, {}

aggregateIdsByType = (index, doc)->
  if not doc.found then return index
  { _type, _id } = doc
  index[_type] or= []
  index[_type].push _id
  return index
