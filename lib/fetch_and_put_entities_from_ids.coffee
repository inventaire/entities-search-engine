# POST index, ids
# => fetch entities
# => PUT on ES

CONFIG = require 'config'
values = require 'lodash.values'
compact = require 'lodash.compact'
got = require 'got'
bulkPost = require './bulk_post_to_elasticsearch'
wdk = require 'wikidata-sdk'

module.exports = (type, ids)->
  console.log 'type'.cyan, type
  console.log 'ids'.cyan, ids[0..10], '[...]'.grey

  unless type in CONFIG.types
    res.status(400).send { unknown_type: type }
    console.log "#{type} not in types whitelist:\n".yellow, CONFIG.types
    return

  # filtering-out properties and blank nodes (type: bnode)
  ids = ids.filter wdk.isItemId

  if typeof ids is 'string' then ids = ids.split '|'

  # generate urls for batches of 50 entities
  urls = wdk.getManyEntities
    ids: ids
    # omitting type, claims, sitelinks
    props: ['labels', 'aliases', 'descriptions']

  putNextBatch = ->
    url = urls.shift()
    unless url?
      console.log 'done putting batches'.green
      return

    console.log 'putting next batch'.green, url

    got.get url
    .then (res)->
      { entities } = res.body

      # logging possible empty values that will be filtered-out by 'compact'
      for k, v of entities
        unless v? then console.warn 'missing value: ignored', k

      return bulkPost type, compact(values(entities))
    .then putNextBatch
    .catch (err)->
      console.error 'putNextBatch err'.red, err, err.response.body
      throw err

  return putNextBatch()
