{ host: elasticHost } = require('config').elastic
breq = require 'bluereq'
bulk = require '../lib/bulk'
_ = require '../lib/utils'
buildLine = bulk.buildLine.bind null, 'index'
index = 'fixtures'
type = 'foo'

getDocs = -> [
  { _id: '1', text: '1' }
  { _id: '2', text: '2' }
  { _id: '3', text: '3' }
  { _id: '4', text: '4' }
]

module.exports =
  reset: ->
    deleteIndex index
    .delay 100
    .then createIndex
    .delay 100
    .then postDocs
    .delay 100
    .catch _.Error('init fixtures err')

  getById: (id)->
    breq.get "#{elasticHost}/#{index}/#{type}/#{id}"
    .get 'body'

createIndex = -> breq.post "#{elasticHost}/#{index}"
deleteIndex = ->
  breq.delete "#{elasticHost}/#{index}"
  .catch (err)->
    if err.statusCode is 404 then return
    throw err

postDocs = ->
  batch = []
  getDocs().forEach addToBatch(batch)
  bulk.postBatch batch
  .then bulk.logRes('fixtures bulk')

addToBatch = (batch)-> (doc)->
  batch.push buildLine(index, type, doc._id)
  # Should not be included in the doc hereafter
  delete doc._id
  batch.push JSON.stringify(doc)
