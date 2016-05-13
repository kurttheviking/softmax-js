var _ = require('lodash');
var BPromise = require('bluebird');
var debug = require('debug')('softmax');

var async = BPromise.method;

function Algorithm(opts) {
  var options = opts || {};

  if (!(this instanceof Algorithm)) {
    return new Algorithm(options);
  }

  debug('init', options);

  this.arms = _.isUndefined(options.arms) ? 2 : parseInt(options.arms, 10);
  this.gamma = _.isUndefined(options.gamma) ? 1e-7 : parseFloat(options.gamma);
  this.tau = (_.isNull(options.tau) || _.isUndefined(options.tau)) ? null : parseFloat(options.tau);

  if (this.arms < 1) {
    throw new TypeError('invalid arms: cannot be less than 1');
  } else if (this.gamma < 0) {
    throw new TypeError('invalid gamma: cannot be less than 0');
  } else if (!_.isNull(this.tau) && this.tau < 0) {
    throw new TypeError('invalid tau: cannot be less than 0');
  }

  if (_.has(options, 'counts') && _.has(options, 'values')) {
    if (!_.isArray(options.counts)) {
      throw new TypeError('counts must be an array');
    } else if (!_.isArray(options.values)) {
      throw new TypeError('values must be an array');
    } else if (options.counts.length !== this.arms) {
      throw new Error('arms and counts.length must be identical');
    } else if (options.values.length !== this.arms) {
      throw new Error('arms and values.length must be identical');
    }

    this.counts = options.counts.slice(0);
    this.values = options.values.slice(0);
  } else {
    this.counts = _.times(this.arms, _.constant(0));
    this.values = this.counts.slice(0);
  }
}

Algorithm.prototype.reward = async(require('./Algorithm/reward'));
Algorithm.prototype.select = async(require('./Algorithm/select'));
Algorithm.prototype.serialize = async(require('./Algorithm/serialize'));

module.exports = Algorithm;
