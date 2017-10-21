formatEntity = require './format_entity'
haveSpecialImagesGetter = require './have_special_images_getter'
addEntitiesImages = require './add_entities_images'
_ = require 'lodash'

module.exports = (type)-> (entities)->
  if type in haveSpecialImagesGetter
    return addEntitiesImages(entities).then formatEntities
  else
    # Images will simply be taken from claims during formatting
    return Promise.resolve formatEntities(entities)

formatEntities = (entities)->
  unless entities instanceof Array
    entities = _.values entities

  return entities.map formatEntity
