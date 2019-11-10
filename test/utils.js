/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('../lib/utils');

module.exports = {
  // A function to quickly fail when a test gets an undesired positive answer
  undesiredRes(done){ return function(res){
    done(new Error('.then function was expected not to be called'));
    return _.warn(res, 'undesired positive res');
  }; },

  undesiredErr(done){ return function(err){
    done(err);
    return _.warn(err.body || err, 'undesired err body');
  }; }
};
