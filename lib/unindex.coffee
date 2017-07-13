{ host:elasticHost } = require('config').elastic
breq = require 'bluereq'
bulk = require './bulk'
buildLine = bulk.buildLine.bind null, 'delete'
_ = require './utils'

module.exports = (index, type, uris)->
  if uris.length is 0 then return Promise.resolve()

  _.log uris, 'unindexed'

  batch = uris.map(unprefixify).map buildLine.bind(null, index, type)

  breq.post "#{elasticHost}/_bulk", bulk.joinLines(batch)
  .then bulk.logRes('bulk unindex res')
  .catch _.Error('unindex err')

# If it has a URI prefix (like 'wd' or 'inv'), remove it
# as entities are indexed with there sole id, the domain being represented
# by the index
unprefixify = (uri)-> uri.replace /(inv:|wd:)/, ''
