#!/usr/bin/env node
// Pass the path of a results json file, supposedly made of an array of ids:
// all those ids documents will be deleted
const [ index, type, resultPath ] = process.argv.slice(2)
const path = require('path')
const ids = require(path.resolve(resultPath))
const logger = require('../lib/logger')
const { wait } = require('../lib/utils')
const unindex = require('../lib/unindex')

logger.info(ids.length, 'ids total')

const deleteNextBulk = () => {
  logger.info(ids.length, 'remaining')

  const idsBatch = ids.splice(0, 1000)

  if (idsBatch.length === 0) {
    logger.success('done')
    return
  }

  return unindex(index, type, idsBatch)
  .then(() => wait(200))
  .then(deleteNextBulk)
}

deleteNextBulk()
