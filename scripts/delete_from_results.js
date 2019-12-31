#!/usr/bin/env node
// Pass the path of a results json file, supposedly made of an array of ids:
// all those ids documents will be deleted
const [ index, type, resultPath ] = process.argv.slice(2)
const path = require('path')
const ids = require(path.resolve(resultPath))
const _ = require('../lib/utils')
const unindex = require('../lib/unindex')

_.info(ids.length, 'ids total')

const deleteNextBulk = () => {
  _.info(ids.length, 'remaining')

  const idsBatch = ids.splice(0, 1000)

  if (idsBatch.length === 0) {
    _.success('done')
    return
  }

  return unindex(index, type, idsBatch)
  .delay(200)
  .then(deleteNextBulk)
}

deleteNextBulk()
