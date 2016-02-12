var debug = require('debug')('softmax:serialize');

function serialize() {
  var out = {
    arms: this.arms,
    gamma: this.gamma,
    tau: this.tau,
    counts: this.counts.slice(0),
    values: this.values.slice(0)
  };

  debug('serializing', out);
  return out;
}

module.exports = serialize;
