module.exports =
  port: 3213
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
