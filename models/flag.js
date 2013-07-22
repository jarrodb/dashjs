/*
 * Flag - conforms to the Variable interface
 *
 * Think of a Flag as a state machine in either [OK, STALE, FAIL].
 *
 * STALE  - indicates that the Flag has gone from OK to STALE due to a lack of
 *          reporting within the stale window as defined on the flag
 * FAIL   - indicates either a reported error or that the expiration window
 *          timed out
 * OK     - the last reported metric is acceptable and no timeout (stale or
 *          expires) has been reached
 */

var level = require('../libs/level');
var uuid = require('node-uuid');

var Flag = new level.Model(
  {
      name    : {type: String}
    , symbol  : {type: String, default: 'flag'} // font-awesome class name for
                                                // a symbol, w/o 'icon-'
    , hash    : {type: String, default: uuid.v4 }
    , stale   : {type: Number, default: -1} // seconds till converts to stale
    , expires : {type: Number, default: -1} // seconds till expire and FAIL.
                                            // note if this is bigger than the
                                            // stale value, you will skip stale
                                            // and go straight to fail
  }, {
      _key: 'hash'
    , transform : function() {
        // stuff
      }
    , render : function(format) {

      }
    , update : function(val, ts) {
        // moar stuff
      }
  }
);

level.model('Flag', Flag);

