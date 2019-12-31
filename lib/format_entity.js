const wdk = require('wikidata-sdk')
const { simplify } = wdk
const { getEntityId } = require('./helpers')
const getImagesFromClaims = require('./get_images_from_claims')

module.exports = entity => {
  let needSimplification
  entity.id = getEntityId(entity)

  if (wdk.isItemId(entity.id)) {
    // Only Wikidata entities need to be simplified: inv entities are already
    // Wikidata entities with a URI come from the Inventaire API
    // and are thus already simplified
    needSimplification = entity.uri == null
    entity.uri = 'wd:' + entity.id
  } else {
    needSimplification = false
    entity.uri = 'inv:' + entity.id
    // Deleting inv entities CouchDB documents ids
    delete entity._id
  }

  // Take images from claims if no images object was set by add_entities_images,
  // that is, for every entity types but works and series
  if (!entity.images) {
    entity.images = getImagesSync(entity.claims, needSimplification)
  }

  // Inventaire entities are already simplified
  if (needSimplification) {
    entity.labels = simplify.labels(entity.labels)
    entity.aliases = simplify.aliases(entity.aliases)
    entity.descriptions = simplify.descriptions(entity.descriptions)
  }

  // Saving space by not indexing claims
  delete entity.claims
  // Deleting if it wasn't already omitted to be consistent
  delete entity.type

  return entity
}

var getImagesSync = (claims, needSimplification) => ({
  claims: getImagesFromClaims(claims, needSimplification)
})
