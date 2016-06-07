###*
 * @param  {Array}
 * @param  {String}
 * @param  {Function} with signature (type, callback)->
###
module.exports = (types, label, fn)->
  executeNext = ->
    type = types.shift()
    console.log "#{label} starting".blue, type
    fn type, (err, res)->
      if err then console.log 'query failed'.red, err
      else
        console.log "#{label} done".green, type, res
        if types.length > 0 then executeNext()

  executeNext()
  return
