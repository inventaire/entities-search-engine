#!/usr/bin/env node
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let batchLength;
const [ type ] = Array.from(process.argv.slice(2));
const split = require('split');
const _ = require('./utils');

if ((type == null) || !/^\w+$/.test(type)) {
  throw new Error(`invalid type: ${type}`);
}

const { removeTrailingComma, isJsonLine, logCount } = require('./helpers');
const formatEntities = require('./format_entities')(type);
const bulkPost = require('./bulk_post_to_elasticsearch');

const haveSpecialImagesGetter = require('./have_special_images_getter');
if (haveSpecialImagesGetter.includes(type)) {
  batchLength = 100;
} else {
  batchLength = 1000;
}

const lineStream = process.stdin.pipe(split());

const formattingBatch = [];
let entitiesBatch = [];
let lineCount = 0;
const onLine = function(line){
  lineCount++;
  // ignore empty lines
  if ((line === '') || (line === '[') || (line === ']')) { return; }

  line = removeTrailingComma(line);

  // discard invalid lines
  if (!isJsonLine(line)) {
    _.error(line, `invalid line: ${lineCount}`);
    return;
  }

  entitiesBatch.push(JSON.parse(line));
  if (entitiesBatch.length >= batchLength) { formatAndPutCurrentBatch(); }
  return logCount(lineCount);
};

var formatAndPutCurrentBatch = function() {
  let currentBatch;
  _.success(entitiesBatch.length, 'putting batch...');
  [ currentBatch, entitiesBatch ] = Array.from([ entitiesBatch, [] ]);

  // Pause to limit the amount of concurrent batches being formatted to one
  lineStream.pause();

  return formatAndPutBatch(currentBatch)
  .then(() => lineStream.resume())
  .catch(err => _.error([ err, err.body ], 'formatAndPutBatch err body'));
};

var formatAndPutBatch = batch => formatEntities(batch)
.then(formattedEntities => bulkPost(type, formattedEntities));

const done = () => // last batch
formatAndPutBatch(entitiesBatch)
.then(() => _.success('done!'));

lineStream
.on('data', onLine)
.on('error', _.Error('stream error'))
.on('close', done);
