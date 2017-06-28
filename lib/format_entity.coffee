module.exports = (entity)->
  image = entity.claims.P18?[0]
  if image? then entity.image = image
  # Saving space by not indexing claims
  delete entity.claims
  return entity
