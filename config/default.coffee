module.exports =
  elastic:
    host: 'http://localhost:9200'
    index: 'your-index-name'
    type: 'your-type-name'
    urlBase: -> "#{@host}/#{@index}/#{@type}"
