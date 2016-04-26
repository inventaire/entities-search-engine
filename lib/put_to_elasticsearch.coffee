indexBase = require('config').elastic.urlBase()
console.log 'index url'.blue, indexBase

request = require 'request'

{ buildDocUrl, formatEntity } = require './entity'
{ error } = require './helpers'

module.exports = (type)->
  putFn = (line)->
    entity = formatEntity JSON.parse(line)
    url = buildDocUrl indexBase, type, entity

    options =
      method: 'PUT'
      url: url
      body: entity
      json: true

    cb = (err, res, body)->
      if err then error 'request err', url, err
      else console.log 'success'.green, entity.id

    request options, cb
