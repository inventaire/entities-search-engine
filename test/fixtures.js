// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { host: elasticHost } = require('config').elastic
const breq = require('bluereq')
const bulk = require('../lib/bulk')
const _ = require('../lib/utils')
const buildLine = bulk.buildLine.bind(null, 'index')
const index = 'fixtures'
const type = 'foo'

const getDocs = () => [
  { _id: '1', text: '1' },
  { _id: '2', text: '2' },
  { _id: '3', text: '3' },
  { _id: '4', text: '4' }
]

module.exports = {
  reset () {
    return deleteIndex(index)
    .delay(100)
    .then(createIndex)
    .delay(100)
    .then(postDocs)
    .delay(100)
    .catch(_.Error('init fixtures err'))
  },

  getById (id) {
    return breq.get(`${elasticHost}/${index}/${type}/${id}`)
    .get('body')
  }
}

var createIndex = () => breq.post(`${elasticHost}/${index}`)
var deleteIndex = () => breq.delete(`${elasticHost}/${index}`)
.catch(err => {
  if (err.statusCode === 404) { return }
  throw err
})

var postDocs = function () {
  const batch = []
  getDocs().forEach(addToBatch(batch))
  return bulk.postBatch(batch)
  .then(bulk.logRes('fixtures bulk'))
}

var addToBatch = batch => function (doc) {
  batch.push(buildLine(index, type, doc._id))
  // Should not be included in the doc hereafter
  delete doc._id
  return batch.push(JSON.stringify(doc))
}
