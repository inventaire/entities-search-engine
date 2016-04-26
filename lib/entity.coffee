module.exports =
  buildDocUrl: (base, type, entity)->
    { id } = entity
    return "#{base}/#{type}/#{id}"

  formatEntity: (entity)->
    entity.labels = formatSingleValue entity.labels
    entity.descriptions = formatSingleValue entity.descriptions
    entity.aliases = formatMultiValue entity.aliases

    return entity

formatSingleValue = (values)->
  for lang, value of values
    values[lang] = value.value
  return values

formatMultiValue = (values)->
  for lang, collection of values
    values[lang] = collection.map (v)-> v.value
  return values
