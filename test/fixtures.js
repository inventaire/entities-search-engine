const { host: elasticHost } = require('config').elastic
const request = require('../lib/request')
const bulk = require('../lib/bulk')
const logger = require('../lib/logger')
const { wait } = require('../lib/utils')
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
  reset: () => {
    return deleteIndex(index)
    .then(() => wait(100))
    .then(createIndex)
    .then(() => wait(100))
    .then(postDocs)
    .then(() => wait(100))
    .catch(logger.Error('init fixtures err'))
  },

  getById: id => {
    return request.get(`${elasticHost}/${index}/${type}/${id}`)
    .then(res => res.json())
  }
}

var createIndex = () => request.post({ url: `${elasticHost}/${index}` })

var deleteIndex = () => {
  return request.delete({ url: `${elasticHost}/${index}` })
  .catch(err => {
    if (err.statusCode !== 404) throw err
  })
}

var postDocs = () => {
  const batch = []
  getDocs().forEach(addToBatch(batch))
  return bulk.postBatch(batch)
  .then(bulk.logRes('fixtures bulk'))
}

var addToBatch = batch => doc => {
  batch.push(buildLine(index, type, doc._id))
  // Should not be included in the doc hereafter
  delete doc._id
  return batch.push(JSON.stringify(doc))
}
