var _ = require('lodash');
var debug = require('debug')('softmax:select');

function select() {
  var accum = 0;
  var arm;
  var r = _.random(0, 1, true);
  var temp = this.tau || 1 / Math.log(_.sum(this.counts) + 1 + this.gamma);
  var values;
  var z;

  values = this.values.map(function adjustObservedValue(val) {
    return Math.exp(val / temp);
  });

  z = _.sum(values);

  values = values.map(function scaleAdjustedValue(val) {
    return val / z;
  });

  _.forEach(values, function findBestArm(val, i) {
    accum += val;

    if (accum > r) {
      arm = i;
      return false;
    }
  });

  debug('selected arm %s with r %s');
  return arm;
}

module.exports = select;
