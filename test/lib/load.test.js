/* global describe, it */
/* eslint func-names: 0*/
var _ = require('lodash');
var chai = require('chai');

var expect = chai.expect;

describe('#load(state)', function () {
  var Algorithm = require('../../index');
  var arms = _.random(1, 10);
  var gamma = _.random(0, 1e-5, true);
  var tau = _.random(0, 1e-5, true);
  var state = {
    arms: arms,
    counts: Array.apply(null, Array(arms)).map(Number.prototype.valueOf, 0),
    values: Array.apply(null, Array(arms)).map(Number.prototype.valueOf, 0)
  };

  state.counts = state.counts.map(function () {
    return _.random(0, 10);
  });

  state.values = state.values.map(function () {
    return _.random(0, 1, true);
  });

  it('restores instance properties (with gamma)', function () {
    var alg = new Algorithm();
    alg.load(_.extend({ gamma: gamma }, state));

    expect(alg.arms).to.equal(state.arms);
    expect(alg.gamma).to.equal(gamma);
    expect(alg.tau).to.equal(null);
    expect(alg.counts).to.deep.equal(state.counts);
    expect(alg.values).to.deep.equal(state.values);
  });

  it('restores instance properties (with tau)', function () {
    var alg = new Algorithm();
    alg.load(_.extend({ tau: tau }, state));

    expect(alg.arms).to.equal(state.arms);
    expect(alg.tau).to.equal(tau);
    expect(alg.counts).to.deep.equal(state.counts);
    expect(alg.values).to.deep.equal(state.values);
  });

  it('resolves to the total count of observed rounds', function () {
    var alg = new Algorithm();

    return alg.load(state).then(function (n) {
      expect(n).to.equal(_.sum(state.counts));
    });
  });

  it('throws if counter length does not equal arm count', function () {
    var alg = new Algorithm();

    var _state = _.cloneDeep(state);
    _state.counts.pop();

    return alg.load(_state).catch(function (err) {
      expect(err).to.match(/arms and counts accumulator length must be identical/);
    });
  });

  it('throws if values length does not equal arm count', function () {
    var alg = new Algorithm();

    var _state = _.cloneDeep(state);
    _state.values.pop();

    return alg.load(_state).catch(function (err) {
      expect(err).to.match(/arms and values accumulator length must be identical/);
    });
  });
});
