{ simplify, simplifyPropertyClaims } = require 'wikidata-sdk'
{ getEntityId } = require './helpers'

module.exports = (entity)->
  entity.id = getEntityId entity
  # Deleting inv entities CouchDB documents ids
  delete entity._id

  # Only Wikidata entities need to be simplified: inv entities are already
  # Wikidata entities with a URI come from the Inventaire API
  # and are thus already simplified
  needSimplification = entity.id[0] is 'Q' and not entity.uri?

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
