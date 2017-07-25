counter = 0

module.exports = helpers =
  removeTrailingComma: (line)-> line.replace /,$/, ''

  isJsonLine: (line)-> line[0] is '{' and line.slice(-1)[0] is '}'

  logCount: (counter)->
    # only log once every 100 calls to avoid slowing the process
    # by just logging things
    if counter % 100 is 0 then console.log counter

  getEntityId: (entity)->
    # Working around differences in entities formatting between
    # - Wikidata entities from a dump or from Wikidata API (entity.id)
    # - Wikidata entities with inventaire formatting (entity.uri)
    #   (returned in case of Inventaire entity redirection)
    # - Inventaire entities (entity.uri)
    return entity.uri?.split(':')[1] or entity.id

  getEntityUri: (entity)->
    # Wikidata and Inventaire entities coming from the Inventaire API
    # have a URI already defined
    if entity.uri? then return entity.uri
    # Wikidata entities coming from a Wikidata dump or the Wikidata API
    # have only an id defined
    else if entity.id? then 'wd:' + entity.id
    else throw new Error("couldn't find entity URI: #{JSON.stringify(entity)}")

  getEntityDomain: (entity)-> helpers.getEntityUri(entity).split(':')[0]
