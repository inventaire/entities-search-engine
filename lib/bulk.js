/* eslint-disable
    no-useless-escape,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let bulk
const _ = require('./utils')
const { values } = require('lodash')
const breq = require('bluereq')
const { host: elasticHost } = require('config').elastic

module.exports = (bulk = {
  buildLine (action, index, type, id) {
    return `{\"${action}\":{\"_index\":\"${index}\",\"_type\":\"${type}\",\"_id\":\"${id}\"}}`
  },

  joinLines (lines) {
    if (!(lines instanceof Array) || (lines.length <= 0)) {
      throw new Error('invalid lines')
    }
    // It is required to end by a newline break
    return lines.join('\n') + '\n'
  },

  logRes (label) {
    return function (res) {
      res = JSON.parse(res.body)
      const globalStatus = {}

      res.items.forEach(item => (() => {
        const result = []
        for (const operation in item) {
          const opRes = item[operation]
          if (globalStatus[operation] == null) { globalStatus[operation] = { success: 0, error: 0 } }
          if (opRes.status >= 400) {
            _.warn(item, `${label} failed`)
            result.push(globalStatus[operation].error++)
          } else {
            result.push(globalStatus[operation].success++)
          }
        }
        return result
      })())

      return _.log(globalStatus, label, getLoggerColor(globalStatus))
    }
  },

  postBatch (batch) {
    return breq.post({
      url: `${elasticHost}/_bulk`,
      headers: { 'Content-Type': 'application/json' },
      body: bulk.joinLines(batch),
      // See https://github.com/inventaire/entities-search-engine/issues/4#issuecomment-393832703
      json: false
    })
  }
})

var getLoggerColor = function (globalStatus) {
  const totalSuccesses = aggregateAttribute(globalStatus, 'success')
  const totalErrors = aggregateAttribute(globalStatus, 'errors')
  if ((totalSuccesses > 0) && (totalErrors > 0)) { return 'yellow' }
  if (totalSuccesses > 0) { return 'green' }
  return 'red'
}

var aggregateAttribute = (globalStatus, attribute) => values(globalStatus)
.map(obj => obj[attribute])
.reduce(sum, 0)

var sum = (a, b) => a + b
