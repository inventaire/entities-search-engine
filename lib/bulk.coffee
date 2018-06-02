_ = require './utils'
breq = require 'bluereq'
{ host: elasticHost } = require('config').elastic

module.exports = bulk =
  buildLine: (action, index, type, id)->
    "{\"#{action}\":{\"_index\":\"#{index}\",\"_type\":\"#{type}\",\"_id\":\"#{id}\"}}"

  joinLines: (lines)->
    unless lines instanceof Array and lines.length > 0
      throw new Error('invalid lines')
    # It is required to end by a newline break
    return lines.join('\n') + '\n'

  logRes: (label)-> (res)->
    res = JSON.parse res.body
    globalStatus = {}

    res.items.forEach (item)->
      for operation, opRes of item
        globalStatus[operation] ?= { success: 0, error: 0 }
        if opRes.status >= 400
          _.warn item, "#{label} failed"
          globalStatus[operation].error++
        else
          globalStatus[operation].success++

    _.log globalStatus, label, getLoggerColor(globalStatus)

  postBatch: (batch)->
    _.log batch, 'batch'
    breq.post
      url: "#{elasticHost}/_bulk"
      headers: { 'Content-Type': 'application/json' }
      body: bulk.joinLines batch
      # See https://github.com/inventaire/entities-search-engine/issues/4#issuecomment-393832703
      json: false

getLoggerColor = (globalStatus)->
  totalSuccesses = aggregateAttribute globalStatus, 'success'
  totalErrors = aggregateAttribute globalStatus, 'errors'
  if totalSuccesses > 0 and totalErrors > 0 then return 'yellow'
  if totalSuccesses > 0 then return 'green'
  return 'red'

aggregateAttribute = (globalStatus, attribute)->
  Object.values globalStatus
  .map (obj)-> obj[attribute]
  .reduce sum, 0

sum = (a, b)-> a + b
