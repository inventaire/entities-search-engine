// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/**
 * @param  {Array}
 * @param  {String}
 * @param  {Function} with signature (type, callback)->
*/
const _ = require('../../lib/utils')

module.exports = function (types, label, fn) {
  // Cloning types to keep the initial object intact
  types = types.slice()
  var executeNext = function () {
    const type = types.shift()
    _.info(type, `${label} starting`)

    return fn(type)
    .then(() => { if (types.length > 0) { return executeNext() } })
  }

  return executeNext()
}
