{ simplify } = require 'wikidata-sdk'

module.exports =
  buildDocUrl: (base, type, entity)->
    { id } = entity
    return "#{base}/#{type}/#{id}"

  formatEntity: (entity)->
    entity.labels = simplify.labels entity.labels
    entity.aliases = simplify.aliases entity.aliases
    entity.descriptions = simplify.descriptions entity.descriptions
    return entity
