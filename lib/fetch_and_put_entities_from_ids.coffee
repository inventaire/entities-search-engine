CONFIG = require 'config'
values = require 'lodash.values'
compact = require 'lodash.compact'
got = require 'got'
bulkPost = require './bulk_post_to_elasticsearch'
wdk = require 'wikidata-sdk'
# omitting type, sitelinks
props = [ 'labels', 'aliases', 'descriptions', 'claims' ]
formatEntity = require './format_entity'
addEntitiesImages = require './add_entities_images'
whitelist = CONFIG.types
_ = require './utils'
haveSpecialImagesGetter = [ 'works', 'series' ]

module.exports = (type, ids)->
  unless type in whitelist
    _.warn "#{type} not in types whitelist"
    err = new Error 'non whitelisted type'
    err.statusCode = 400
    err.context = [ { type, whitelist } ]
    return Promise.reject err

  _.log ids, "#{type} ids"

  # filtering-out properties and blank nodes (type: bnode)
  ids = ids.filter wdk.isItemId

  if typeof ids is 'string' then ids = ids.split '|'

  # generate urls for batches of 50 entities
  urls = wdk.getManyEntities { ids, props }

  return PutNextBatch(type, urls)()

PutNextBatch = (type, urls)->
  return putNextBatch = ->
    url = urls.shift()
    unless url?
      _.success "done putting #{type} batches"
      return

    _.success url, "putting next #{type} batch"

    got.get url, { json: true }
    .then removeMissingEntities
    .then addImages(type)
    .then formatEntities
    .then bulkPost.bind(null, type)
    # Will call itself until there is no more urls to fetch
    .then putNextBatch
    .catch logAndRethrow

removeMissingEntities = (res)->
  { entities } = res.body
  for id, entity of entities
    unless entity?
      _.warn id, 'missing value: ignored'
      delete entities[id]

  return entities

addImages = (type)-> (entities)->
  # Images will simply be taken from claims during formatting
  if type not in haveSpecialImagesGetter then return entities
  else return addEntitiesImages entities

formatEntities = (entities)-> values(entities).map formatEntity

logAndRethrow = (err)->
  _.error err, 'putNextBatch err'
  _.error err.response.body, 'putNextBatch err response body'
  throw err
