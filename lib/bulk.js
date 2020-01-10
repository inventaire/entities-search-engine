const logger = require('./logger')
const { values } = require('lodash')
const { get, post } = require('./request')
const { host: elasticHost } = require('config').elastic

const bulk = module.exports = {
  buildLine: (action, index, type, id) => {
    return `{"${action}":{"_index":"${index}","_type":"${type}","_id":"${id}"}}`
  },

  joinLines: lines => {
    if (!(lines instanceof Array && lines.length > 0)) {
      throw new Error('invalid lines')
    }
    // It is required to end by a newline break
    return lines.join('\n') + '\n'
  },

  logRes: label => async res => {
    const { items } = await res.json()
    const globalStatus = {}

    items.forEach(item => {
      for (const operation in item) {
        const opRes = item[operation]
        if (globalStatus[operation] == null) {
          globalStatus[operation] = { success: 0, error: 0 }
        }
        if (opRes.status >= 400) {
          logger.warn(item, `${label} failed`)
          globalStatus[operation].error++
        } else {
          globalStatus[operation].success++
        }
      }
    })

    logger.log(globalStatus, label, getLoggerColor(globalStatus))
  },

  postBatch: batch => {
    return post({
      url: `${elasticHost}/_bulk`,
      headers: { 'Content-Type': 'application/json' },
      body: bulk.joinLines(batch)
    })
  }
}

var getLoggerColor = globalStatus => {
  const totalSuccesses = aggregateAttribute(globalStatus, 'success')
  const totalErrors = aggregateAttribute(globalStatus, 'errors')
  if (totalSuccesses > 0 && totalErrors > 0) return 'yellow'
  if (totalSuccesses > 0) return 'green'
  return 'red'
}

var aggregateAttribute = (globalStatus, attribute) => {
  return values(globalStatus)
  .map(obj => obj[attribute])
  .reduce(sum, 0)
}

var sum = (a, b) => a + b
