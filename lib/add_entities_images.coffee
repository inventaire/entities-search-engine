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

  url = "#{invHost}/api/entities?action=images&uris=#{uris.join('|')}"

  console.log('url', url)

  breq.get url
  .then (res)->
    { images } = res.body
    for uri, entityImages of images
      id = uri.split(':')[1]
      entities[id].images = entityImages

    return entities

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
