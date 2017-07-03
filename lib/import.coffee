#!/usr/bin/env coffee
[ index, type ] = process.argv.slice 2
split = require 'split'
_ = require './utils'

# inventaire indexes have the name of their CouchDB databases
# ex: entities-prod
unless index is 'wikidata' or index.split('-')[0] is 'entities'
  throw new Error "invalid index: #{index}"

unless type? and /^\w+$/.test type
  throw new Error "invalid type: #{type}"

{ removeTrailingComma, isJsonLine, logCount } = require './helpers'
formatEntities = require('./format_entities')(type)
bulkPost = require './bulk_post_to_elasticsearch'

haveSpecialImagesGetter = require './have_special_images_getter'
if type in haveSpecialImagesGetter
  batchLength = 100
else
  batchLength = 1000

lineStream = process.stdin.pipe split()

formattingBatch = []
entitiesBatch = []
lineCount = 0
onLine = (line)->
  lineCount++
  # ignore empty lines
  if line is '' or line is '[' or line is ']' then return

  line = removeTrailingComma line

  # discard invalid lines
  unless isJsonLine line
    _.error line, "invalid line: #{lineCount}"
    return

  entitiesBatch.push JSON.parse(line)
  if entitiesBatch.length >= batchLength then formatAndPutCurrentBatch()
  logCount lineCount

formatAndPutCurrentBatch = ->
  _.success entitiesBatch.length, 'putting batch...'
  [ currentBatch, entitiesBatch ] = [ entitiesBatch, [] ]

  # Pause to limit the amount of concurrent batches being formatted to one
  lineStream.pause()

  formatAndPutBatch currentBatch
  .then -> lineStream.resume()
  .catch (err)-> _.error [ err, err.body ], 'formatAndPutBatch err body'

formatAndPutBatch = (batch)->
  formatEntities batch
  .then (formattedEntities)-> bulkPost index, type, formattedEntities

done = ->
  # last batch
  formatAndPutBatch entitiesBatch
  .then -> _.success 'done!'

lineStream
.on 'data', onLine
.on 'error', _.Error('stream error')
.on 'close', done
