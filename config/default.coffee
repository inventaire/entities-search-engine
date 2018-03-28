module.exports =
  port: 3213
  elastic:
    host: 'http://localhost:9200'
    indexes:
      wikidata: 'wikidata'
      # Match CouchDB database names
      inventaire: 'entities'
  types: [
    'works'
    'humans'
    'genres'
    'movements'
    'publishers'
    'series'
    'collections'
  ]
  inventaire:
    host: 'http://localhost:3006'
