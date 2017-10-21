_ = require 'lodash'
{ simplifyClaim } = require 'wikidata-sdk'

imageClaims = [
  # image
  'P18'
  # logo image
  'P154'
  # collage image
  'P2716'
]

getCommonsImages = (claims, needSimplification)->
  images = _.flatten _.values(_.pick(claims, imageClaims))
  if needSimplification then images.map simplifyClaim
  else images

avatarUrlBuilders =
  # twitter
  P2002: (id)-> "https://twitter.com/#{id}/profile_image?size=original"
  # facebook
  P2013: (id)-> "https://graph.facebook.com/#{id}/picture?type=large"

getAvatars = (claims, needSimplification)->
  images = []
  for property, builderFn of avatarUrlBuilders
    # Working around differences between Wikidata entities arriving without
    # property prefix and Inventaire entities coming with it
    prop = property.replace 'wdt:', ''
    websiteClaims = claims[prop] or claims["wdt:#{prop}"]
    websiteId = websiteClaims?[0]
    if websiteId?
      if needSimplification then websiteId = simplifyClaim websiteId
      images.push avatarUrlBuilders[prop](websiteId)

  return images

module.exports = (claims, needSimplification)->
  getCommonsImages claims, needSimplification
  .concat getAvatars(claims, needSimplification)
