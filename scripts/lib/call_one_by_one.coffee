###*
 * @param  {Array}
 * @param  {String}
 * @param  {Function} with signature (type, callback)->
###
module.exports = (types, label, fn)->
  # Cloning types to keep the initial object intact
  types = types.slice()
  executeNext = ->
    type = types.shift()
    console.log "#{label} starting".blue, type

    fn type
    .then -> if types.length > 0 then return executeNext()

  return executeNext()
