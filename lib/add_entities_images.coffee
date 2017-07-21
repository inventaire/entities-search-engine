breq = require 'bluereq'
values = require 'lodash.values'
{ host:invHost } = require('config').inventaire
_ = require './utils'

module.exports = (entities)->
  if entities instanceof Array
    uris = entities.map getEntityUri
    entities = indexById entities
  else
    uris = values(entities).map getEntityUri

  # Add images one by one as each request might need a SPARQL request
  # which is rate limited to 5 request at once
  addImageToNextEntity = ->
    uri = uris.pop()

    # When there is no more URIs,
    # return the updated entities as final results
    unless uri? then return entities

    console.log 'add image to next entity', uri

    breq.get "#{invHost}/api/entities?action=images&uris=#{uri}"
    .then (res)->
      { images } = res.body
      entityImages = values(images)[0]

      # Working around the difference between Wikidata that returns entities
      # indexed by Wikidata id and Inventaire that index by URIs
      id = uri.split(':')[1]
      entity = entities[id] or entities[uri]

      entity.images = entityImages

      return

    .then addImageToNextEntity

  return addImageToNextEntity()

getEntityUri = (entity)->
  # At this point Wikidata entities have entity.id defined
  # while inventaire entities have entity._id
  if entity.id? then 'wd:' + entity.id
  else 'inv:' + entity._id

indexById = (entities)->
  index = {}
  entities.forEach (entity)->
    id = entity.id or entity._id
    index[id] = entity
  return index
