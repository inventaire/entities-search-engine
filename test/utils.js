const logger = require('../lib/logger')

module.exports = {
  // A function to quickly fail when a test gets an undesired positive answer
  undesiredRes: done => res => {
    done(new Error('.then function was expected not to be called'))
    logger.warn('undesired positive res', res)
  },

  undesiredErr: done => err => {
    done(err)
    logger.warn('undesired err body', err.context.responseData || err)
  }
}
