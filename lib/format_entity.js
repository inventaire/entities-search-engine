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

  if (Object.keys(entity.labels).length === 0) {
    const { claims } = entity
    const title = claims['wdt:P1476'] && claims['wdt:P1476'][0]
    const subtitle = claims['wdt:P1680'] && claims['wdt:P1680'][0]
    if (title) entity.labels = { fromclaims: title }
    if (subtitle && entity.descriptions == null) {
      entity.descriptions = { fromclaims: subtitle }
    }
  }

  // Saving space by not indexing claims
  delete entity.claims
  // Deleting if it wasn't already omitted to be consistent
  delete entity.type

  // Remove langs not used by inventaire-i18n
  // as entity object indexation shall be less than 1000 keys long
  // See: https://discuss.elastic.co/t/limit-of-total-fields-1000-in-index-has-been-exceeded-particular-jsons/222627
  removeUnusedLangs(entity)

  return entity
}

const getImagesSync = (claims, needSimplification) => ({
  claims: getImagesFromClaims(claims, needSimplification)
})

const langs = 'ar bn ca cs da de el eo es fr hu id it ja nb nl pa pl pt ro ru sk sv tr uk'.split(' ')
// Keep in sync with inventaire-i18n/assets/translated_langs

const removeUnusedLangs = entity => {
  let { labels, descriptions, aliases } = entity
  labels = simplifyTerms(labels)
  descriptions = simplifyTerms(descriptions)
  aliases = simplifyTerms(aliases)
}

const simplifyTerms = term => {
  filteredTerms = {}
  langs.forEach(lang => {
    if (term[lang]) {
      filteredTerms[lang] = term[lang]
    }
  })
  return filteredTerms
}
