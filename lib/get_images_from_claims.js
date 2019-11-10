/* eslint-disable
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('lodash')
const { simplifyClaim } = require('wikidata-sdk')

const imageClaims = [
  // image
  'P18',
  // logo image
  'P154',
  // collage image
  'P2716'
]

const getCommonsImages = function (claims, needSimplification) {
  const images = _.flatten(_.values(_.pick(claims, imageClaims)))
  if (needSimplification) {
    return images.map(simplifyClaim)
  } else { return images }
}

const avatarUrlBuilders = {
  // twitter
  P2002 (id) { return `https://twitter.com/${id}/profile_image?size=original` },
  // facebook
  P2013 (id) { return `https://graph.facebook.com/${id}/picture?type=large` }
}

const getAvatars = function (claims, needSimplification) {
  const images = []
  for (const property in avatarUrlBuilders) {
    // Working around differences between Wikidata entities arriving without
    // property prefix and Inventaire entities coming with it
    const builderFn = avatarUrlBuilders[property]
    const prop = property.replace('wdt:', '')
    const websiteClaims = claims[prop] || claims[`wdt:${prop}`]
    let websiteId = websiteClaims != null ? websiteClaims[0] : undefined
    if (websiteId != null) {
      if (needSimplification) { websiteId = simplifyClaim(websiteId) }
      images.push(avatarUrlBuilders[prop](websiteId))
    }
  }

  return images
}

module.exports = (claims, needSimplification) => getCommonsImages(claims, needSimplification)
.concat(getAvatars(claims, needSimplification))
