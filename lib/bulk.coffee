_ = require './utils'

module.exports =
  buildLine: (action, index, type, id)->
    "{\"#{action}\":{\"_index\":\"#{index}\",\"_type\":\"#{type}\",\"_id\":\"#{id}\"}}"

  joinLines: (lines)->
    unless lines instanceof Array and lines.length > 0
      throw new Error('invalid lines')
    # It is required to end by a newline break
    return lines.join('\n') + '\n'

  logRes: (label)-> (res)->
    # Avoid logging all the items response objects
    _.log res.body[0..100] + '...', label
