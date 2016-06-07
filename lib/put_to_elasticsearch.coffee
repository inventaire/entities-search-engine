indexBase = require('config').elastic.urlBase()
console.log 'index url'.blue, indexBase

request = require 'request'

{ buildDocUrl, formatEntity } = require './entity'
{ error } = require './helpers'

module.exports = (type)->
  return putFn = (data, parse=true, callback)->
    if parse then data = JSON.parse data
    entity = formatEntity data
    url = buildDocUrl indexBase, type, entity
    callback ?= ->

    options =
      method: 'PUT'
      url: url
      body: entity
      json: true

    request options, (err, res, body)->
      if err
        error 'request err', url, err
        callback err
      else
        console.log 'added'.green, "#{indexBase}/#{type}/#{entity.id}"
        callback null
