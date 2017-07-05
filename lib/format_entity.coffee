{ simplify, simplifyPropertyClaims } = require 'wikidata-sdk'

module.exports = (entity)->
  entity.id or= entity._id
  # Deleting inv entities CouchDB documents ids
  delete entity._id

  # Only Wikidata entities need to be simplified: inv entities are already
  needSimplification = entity.id[0] is 'Q'

  # Take images from claims if no images object was set by add_entities_images,
  # that is, for every entity types but works and series
  entity.images or= getImagesSync entity.claims, needSimplification

  # Inventaire entities are already simplified
  if needSimplification
    entity.labels = simplify.labels entity.labels
    entity.aliases = simplify.aliases entity.aliases
    entity.descriptions = simplify.descriptions entity.descriptions

  # Saving space by not indexing claims
  delete entity.claims
  # Deleting if it wasn't already omitted to be consistent
  delete entity.type

  return entity

getImagesSync = (claims, needSimplification)->
  imageClaims = claims.P18 or []
  if needSimplification then imageClaims = simplifyPropertyClaims imageClaims
  return { claims: imageClaims }
