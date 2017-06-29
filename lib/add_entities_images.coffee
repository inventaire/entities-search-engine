got = require 'got'
values = require 'lodash.values'
{ host:invHost } = require('config').inventaire

module.exports = (entities)->
  uris = values(entities).map getWdEntityUri

  url = "#{invHost}/api/entities?action=images&uris=#{uris.join('|')}"

  console.log('url', url)

  got.get url, { json: true }
  .then (res)->
    { images } = res.body
    for uri, entityImages of images
      id = uri.split(':')[1]
      entities[id].images = entityImages

    return entities

getWdEntityUri = (entity)-> 'wd:' + entity.id
