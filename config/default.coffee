module.exports =
  elastic:
    host: 'http://localhost:9200'
    index: 'wikidata'
    urlBase: -> "#{@host}/#{@index}"
  types: [
    'humans'
    'genres'
    'movements'
    'publishers'
    'series'
  ]
