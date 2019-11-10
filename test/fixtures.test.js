require 'should'
Promise = require 'bluebird'
{ reset: resetFixtures, getById } = require './fixtures'
getIdsByTypes = require '../lib/get_ids_by_types'
_ = require '../lib/utils'

describe 'fixtures', ->
  it 'should create fixtures', (done)->
    resetFixtures 'fixtures'
    .then ->
      Promise.all [
        getById '1'
        getById '2'
        getById '3'
        getById '4'
      ]
    .then (res)->
      res[0]._source.should.deepEqual { text: '1' }
      res[1]._source.should.deepEqual { text: '2' }
      res[2]._source.should.deepEqual { text: '3' }
      res[3]._source.should.deepEqual { text: '4' }
      done()
    .catch done

    return
