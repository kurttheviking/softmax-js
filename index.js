/* jslint node: true */
'use strict';

var _ = require('lodash');
var BPromise = require('bluebird');


var Algorithm = function (options) {
  options = options || {};
  var self = this;

  if (!(self instanceof Algorithm)) {
    return new Algorithm(options);
  }

  var arms = _.isUndefined(options.arms) ? 2 : parseInt(options.arms, 10);
  var gamma = _.isUndefined(options.gamma) ? 1e-7 : parseFloat(options.gamma);
  var tau = _.isUndefined(options.tau) ? null : parseFloat(options.tau);
  var counts = [];
  var values = [];

  if (arms < 1) {
    throw new TypeError('invalid arms: cannot be less than 1');
  }
  else if (gamma < 0) {
    throw new TypeError('invalid gamma: cannot be less than 0');
  }
  else if (!_.isNull(tau) && tau < 0) {
    throw new TypeError('invalid tau: cannot be less than 0');
  }

  for (var i=0; i<arms; i++) {
    counts.push(0);
    values.push(0);
  }

  var api = {};

  api.n = 0;

  api.load = function (config) {
    arms = config.arms;
    gamma = config.gamma;
    tau = config.tau;
    counts = config.counts;
    values = config.values;

    return BPromise.resolve(values);
  };

  api.reward = function (arm, reward) {
    return new BPromise(function (resolve, reject) {
      if (!_.isNumber(arm)) {
        return reject(new TypeError('missing or invalid required parameter: arm'));
      }
      else if (!_.isNumber(reward)) {
        return reject(new TypeError('missing or invalid required parameter: reward'));
      }
      else if (arm >= arms || arm < 0) {
        return reject(new TypeError('invalid arm: ' + arm + ' not in valid range (0-' + arms.length + ')'));
      }

      var ct = ++counts[arm];
      var pre = values[arm];
      var post = ((ct-1) / ct) * pre + (1/ct) * reward;

      values[arm] = post;

      api.n = _.reduce(counts, function (sum, ct) {
        return sum + ct;
      });

      resolve(values);
    });
  };

  api.select = function () {
    return new BPromise(function (resolve) {
      var arm;
      var temp = tau || 1 / Math.log(api.n + 1 + gamma);

      var _values = values.map(function (v) {
        return Math.exp(v / temp);
      });

      var z = _.sum(_values);

      _values = _values.map(function (v) {
        return v / z;
      });

      var accum = 0;
      var r = _.random(0, 1, true);

      _.forEach(_values, function (v, i) {
        accum += v;
        if (accum > r) {
          arm = i;
          return false;
        }
      });

      resolve(arm);
    });
  };

  api.serialize = function () {
    return BPromise.resolve({
      arms: arms,
      gamma: gamma,
      tau: tau,
      counts: counts.slice(0),
      values: values.slice(0)
    });
  };

  return api;
};


module.exports = Algorithm;
