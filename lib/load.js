var _ = require('lodash');
var debug = require('debug')('softmax:load');

function load(state) {
  debug('loading', state);

  this.arms = state.arms;
  this.gamma = state.gamma;
  this.tau = state.tau || null;
  this.counts = state.counts.slice(0);
  this.values = state.values.slice(0);

  if (this.counts.length !== this.arms) {
    throw new Error('arms and counts accumulator length must be identical');
  } else if (this.values.length !== this.arms) {
    throw new Error('arms and values accumulator length must be identical');
  }

  return _.sum(this.counts);
}

module.exports = load;
