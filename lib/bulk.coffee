module.exports =
  buildLine: (action, index, type, id)->
    "{\"#{action}\":{\"_index\":\"#{index}\",\"_type\":\"#{type}\",\"_id\":\"#{id}\"}}"

  joinLines: (lines)->
    # It is required to end by a newline break
    return lines.join('\n') + '\n'
