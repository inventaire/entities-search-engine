// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const formatEntity = require('./format_entity')
const haveSpecialImagesGetter = require('./have_special_images_getter')
const addEntitiesImages = require('./add_entities_images')
const _ = require('lodash')

module.exports = type => function (entities) {
  if (haveSpecialImagesGetter.includes(type)) {
    return addEntitiesImages(entities).then(formatEntities)
  } else {
    // Images will simply be taken from claims during formatting
    return Promise.resolve(formatEntities(entities))
  }
}

var formatEntities = function (entities) {
  if (!(entities instanceof Array)) {
    entities = _.values(entities)
  }

  return entities.map(formatEntity)
}
