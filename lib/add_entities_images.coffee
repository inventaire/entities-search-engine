breq = require 'bluereq'
values = require 'lodash.values'
{ host:invHost } = require('config').inventaire
_ = require './utils'
{ getEntityUri, getEntityId } = require './helpers'

# Assumes that entities in a batch are all from the same domain
batchLengthPerDomain =
  inv: 100
  # Add images of Wikidata entities with small batches as each request might need a SPARQL request
  # which is rate limited to 5 request at once
  wd: 3

module.exports = (entities)->
  if entities instanceof Array
    uris = entities.map getEntityUri
    entities = indexById entities
  else
    uris = values(entities).map getEntityUri

  if uris.length is 0 then return Promise.resolve entities

  domain = uris[0].split(':')[0]
  batchLength = batchLengthPerDomain[domain]

  addImageToNextEntityBatch = ->
    urisBatch = uris.splice(0, batchLength)

    # When there is no more URIs,
    # return the updated entities as final results
    if urisBatch.length is 0 then return entities

    console.log 'add image to next entity batch', urisBatch

    breq.get "#{invHost}/api/entities?action=images&uris=#{urisBatch.join('|')}"
    .then (res)->
      { images } = res.body

      for uri, entityImages of images
        # Working around the difference between Wikidata that returns entities
        # indexed by Wikidata id and Inventaire that index by URIs
        id = uri.split(':')[1]
        entity = entities[id] or entities[uri]

        # Case where we can't find the entity: it was redirected in the meantime
        if entity?
          entity.images = entityImages

      return

    .then addImageToNextEntityBatch

  return addImageToNextEntityBatch()

indexById = (entities)->
  index = {}
  entities.forEach (entity)->
    id = getEntityId entity
    index[id] = entity
  return index
