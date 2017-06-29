{ simplifyPropertyClaims } = require 'wikidata-sdk'

module.exports = (entity)->
  # Take images from claims if no images object was set by add_entities_images,
  # that is, for every entity types but works and series
  entity.images or= getImagesSync entity.claims
  # Saving space by not indexing claims
  delete entity.claims
  # Deleting if it wasn't already omitted to be consistent
  delete entity.type
  return entity

getImagesSync = (claims)->
  imageClaims = claims.P18
  claimsImages = if imageClaims? then simplifyPropertyClaims(imageClaims) else []
  return { claims: claimsImages }
