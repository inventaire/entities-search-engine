const _ = require('../lib/utils')

module.exports = {
  // A function to quickly fail when a test gets an undesired positive answer
  undesiredRes: done => res => {
    done(new Error('.then function was expected not to be called'))
    _.warn(res, 'undesired positive res')
  },

  undesiredErr: done => err => {
    done(err)
    _.warn(err.body || err, 'undesired err body')
  }
}
