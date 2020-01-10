const type = process.argv.slice(2)[0]
const split = require('split')
const logger = require('./logger')

if ((type == null) || !/^\w+$/.test(type)) {
  throw new Error(`invalid type: ${type}`)
}

const { removeTrailingComma, isJsonLine, logCount } = require('./helpers')
const formatEntities = require('./format_entities')(type)
const bulkPost = require('./bulk_post_to_elasticsearch')

const haveSpecialImagesGetter = require('./have_special_images_getter')
const batchLength = haveSpecialImagesGetter.includes(type) ? 100 : 1000

const lineStream = process.stdin.pipe(split())

let entitiesBatch = []
let lineCount = 0
const onLine = line => {
  lineCount++
  // ignore empty lines
  if ((line === '') || (line === '[') || (line === ']')) return

  line = removeTrailingComma(line)

  // discard invalid lines
  if (!isJsonLine(line)) {
    logger.error(`invalid line: ${lineCount}`, line)
    return
  }

  entitiesBatch.push(JSON.parse(line))
  if (entitiesBatch.length >= batchLength) { formatAndPutCurrentBatch() }
  return logCount(lineCount)
}

const formatAndPutCurrentBatch = () => {
  let currentBatch
  logger.success('putting batch...', entitiesBatch.length);
  [ currentBatch, entitiesBatch ] = [ entitiesBatch, [] ]

  // Pause to limit the amount of concurrent batches being formatted to one
  lineStream.pause()

  return formatAndPutBatch(currentBatch)
  .then(() => lineStream.resume())
  .catch(logger.Error('formatAndPutBatch err body'))
}

const formatAndPutBatch = batch => {
  console.log('batch', batch)
  return formatEntities(batch)
  .then(formattedEntities => bulkPost(type, formattedEntities))
}

const done = () => {
  return formatAndPutBatch(entitiesBatch)
  .then(() => logger.success('done!'))
}

lineStream
.on('data', onLine)
.on('error', logger.Error('stream error'))
.on('close', done)
